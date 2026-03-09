"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const recommendation_service_1 = require("../services/recommendation.service");
const prisma_1 = require("../lib/prisma");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const router = express_1.default.Router();
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is missing in .env');
    }
    return new groq_sdk_1.default({ apiKey });
};
// Hàm trích xuất sản phẩm được đề cập trong câu trả lời AI
const extractMentionedProducts = async (aiResponse) => {
    try {
        const allProducts = await prisma_1.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: true,
                rating: true,
                originalPrice: true,
            }
        });
        // Tìm sản phẩm được nhắc tên trong câu trả lời AI
        const mentionedProducts = allProducts.filter(product => {
            const productName = product.name.toLowerCase();
            const response = aiResponse.toLowerCase();
            // Kiểm tra tên sản phẩm hoặc phần tên chính (ít nhất 3 từ đầu)
            const mainName = productName.split(' ').slice(0, 3).join(' ');
            return response.includes(productName) || response.includes(mainName);
        });
        // Trả về tối đa 4 sản phẩm
        return mentionedProducts.slice(0, 4).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category,
            rating: p.rating,
            originalPrice: p.originalPrice,
        }));
    }
    catch (error) {
        console.error('Error extracting products:', error);
        return [];
    }
};
// AI Chat với DB context
router.post('/chat', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // 1. Lấy context từ DB (sản phẩm, lịch sử mua, gợi ý CF)
        const dbContext = await (0, recommendation_service_1.getAIContext)(userId);
        // 2. Tạo prompt với context
        const systemPrompt = `Bạn là trợ lý mua sắm AI cao cấp của TechStore — cửa hàng công nghệ hàng đầu tại Việt Nam.

BẠN CÓ QUYỀN TRUY CẬP DỮ LIỆU THỰC TẾ TỪ DATABASE:
${dbContext}

QUY TẮC PHẢN HỒI:
1. LUÔN sử dụng dữ liệu sản phẩm THỰC TẾ từ danh sách trên để trả lời.
2. Ưu tiên gợi ý các sản phẩm trong danh sách "Collaborative Filtering" vì đây là những thứ khách hàng có khả năng mua cao nhất.
3. Nếu khách hàng đã từng mua sản phẩm (lịch sử mua hàng), hãy gợi ý các phụ kiện hoặc sản phẩm bổ sung phù hợp (UPSELL).
4. Trả lời bằng Tiếng Việt thân thiện, chuyên nghiệp, ngắn gọn nhưng đầy đủ thông tin.
5. Luôn đề cập đến giá bán và thông số nổi bật khi giới thiệu sản phẩm.
6. Khi gợi ý sản phẩm, hãy gọi tên CHÍNH XÁC từ database (ví dụ: "MacBook Air M3", "iPhone 16 Pro Max").
7. Nếu khách hỏi về sản phẩm KHÔNG có trong database, hãy lịch sự từ chối và gợi ý sản phẩm tương tự đang có sẵn.
8. KHÔNG ĐƯỢC bịa đặt tên sản phẩm, giá cả hoặc cấu hình không tồn tại trong hệ thống.`;
        // 3. Gọi Groq API
        const groq = getGroqClient();
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });
        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';
        // 4. Trích xuất sản phẩm được đề cập từ câu trả lời
        const suggestedProducts = await extractMentionedProducts(aiResponse);
        res.json({ response: aiResponse, products: suggestedProducts });
    }
    catch (error) {
        console.error('Lỗi Groq chat:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý AI chat: ' + (error.message || 'Lỗi không xác định') });
    }
});
// AI Chat không cần đăng nhập (public) – hạn chế context
router.post('/chat/public', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const dbContext = await (0, recommendation_service_1.getAIContext)(); // No userId
        const systemPrompt = `Bạn là trợ lý mua sắm AI của TechStore, chuyên viên tư vấn công nghệ chuyên nghiệp.

DỮ LIỆU SẢN PHẨM HIỆN CÓ:
${dbContext}

QUY TẮC:
1. Chỉ sử dụng dữ liệu sản phẩm THỰC TẾ từ danh sách trên.
2. Trả lời bằng Tiếng Việt, lịch sự, hỗ trợ tận tâm.
3. Khi gợi ý sản phẩm, hãy gọi tên CHÍNH XÁC từ database.
4. Nếu không tìm thấy sản phẩm, hãy gợi ý khách hàng đăng nhập để nhận được tư vấn cá nhân hóa hơn.
5. Tuyệt đối không bịa đặt thông tin sản phẩm.`;
        const groq = getGroqClient();
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });
        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';
        // Trích xuất sản phẩm được đề cập
        const suggestedProducts = await extractMentionedProducts(aiResponse);
        res.json({ response: aiResponse, products: suggestedProducts });
    }
    catch (error) {
        console.error('Lỗi Groq chat public:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý AI chat: ' + (error.message || 'Lỗi không xác định') });
    }
});
exports.default = router;
