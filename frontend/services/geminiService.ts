
import { aiChatAPI } from './apiService';

/**
 * Gọi AI chat qua backend — AI có quyền truy cập DB
 * Backend sẽ: query sản phẩm, lịch sử mua, gợi ý CF → inject vào prompt → gọi Gemini
 */
export const getAIRecommendations = async (userQuery: string, currentCart?: string[]): Promise<string> => {
  try {
    // Thêm context giỏ hàng vào message nếu có
    let message = userQuery;
    if (currentCart && currentCart.length > 0) {
      message += `\n\n[Giỏ hàng hiện tại: ${currentCart.join(', ')}]`;
    }

    const data = await aiChatAPI.send(message);
    return data.response || "Xin lỗi, tôi không thể đưa ra gợi ý lúc này.";
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Chúng tôi đang gặp sự cố với AI, vui lòng thử lại sau.";
  }
};

export const analyzeProductSpec = async (productName: string): Promise<string> => {
  try {
    const data = await aiChatAPI.send(`Phân tích ưu nhược điểm và đối tượng sử dụng phù hợp cho sản phẩm: ${productName}. Trả lời ngắn gọn bằng các gạch đầu dòng.`);
    return data.response || "";
  } catch (error) {
    return "Không có dữ liệu phân tích.";
  }
};
