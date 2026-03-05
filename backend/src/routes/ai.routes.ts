import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { getAIContext } from '../services/recommendation.service';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const getGeminiClient = () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY is missing in .env');
    }
    return new GoogleGenAI({ apiKey });
};

// AI Chat với DB context
router.post('/chat', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 1. Lấy context từ DB (sản phẩm, lịch sử mua, gợi ý CF)
        const dbContext = await getAIContext(userId);

        // 2. Tạo prompt với context
        const systemPrompt = `Bạn là trợ lý mua sắm AI cao cấp của TechStore — cửa hàng công nghệ hàng đầu.

BẠN CÓ QUYỀN TRUY CẬP DỮ LIỆU THỰC TẾ TỪ DATABASE:
${dbContext}

QUY TẮC:
1. LUÔN sử dụng dữ liệu sản phẩm THỰC TẾ từ database ở trên để trả lời.
2. Khi gợi ý sản phẩm, ưu tiên sản phẩm từ danh sách Collaborative Filtering.
3. Nếu khách đã mua sản phẩm, gợi ý sản phẩm BỔ SUNG phù hợp.
4. Trả lời bằng Tiếng Việt, chuyên nghiệp, ngắn gọn và thân thiện.
5. Đề cập giá, thông số kỹ thuật cụ thể khi được hỏi.
6. Nếu không có sản phẩm phù hợp, nói rõ và gợi ý thay thế.
7. KHÔNG bịa đặt sản phẩm hoặc giá không có trong database.`;

        // 3. Gọi Gemini API với context
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{
                parts: [
                    { text: systemPrompt },
                    { text: `Câu hỏi của khách hàng: ${message}` }
                ]
            }]
        });

        const aiResponse = response.text || 'Xin lỗi, tôi không thể trả lời lúc này.';
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Lỗi AI chat:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý AI chat' });
    }
});

// AI Chat không cần đăng nhập (public) – hạn chế context
router.post('/chat/public', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const dbContext = await getAIContext(); // No userId

        const systemPrompt = `Bạn là trợ lý mua sắm AI của TechStore.

DỮ LIỆU SẢN PHẨM TỪ DATABASE:
${dbContext}

QUY TẮC:
1. Sử dụng dữ liệu sản phẩm THỰC TẾ ở trên.
2. Trả lời Tiếng Việt, chuyên nghiệp, ngắn gọn.
3. KHÔNG bịa sản phẩm hoặc giá.`;

        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{
                parts: [
                    { text: systemPrompt },
                    { text: `Câu hỏi: ${message}` }
                ]
            }]
        });

        const aiResponse = response.text || 'Xin lỗi, tôi không thể trả lời lúc này.';
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Lỗi AI chat public:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý AI chat' });
    }
});

export default router;
