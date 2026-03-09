"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const recommendation_service_1 = require("../services/recommendation.service");
const router = express_1.default.Router();
// Gợi ý cho user hiện tại (User-based CF)
router.get('/user', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const topK = parseInt(req.query.limit) || 8;
        const recommendations = await (0, recommendation_service_1.getUserBasedRecommendations)(userId, topK);
        res.json({ recommendations, method: 'user-based-cf' });
    }
    catch (error) {
        console.error('Lỗi recommendation user-based:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Sản phẩm thường mua cùng (Item-based CF)
router.get('/item/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const topK = parseInt(req.query.limit) || 6;
        const recommendations = await (0, recommendation_service_1.getItemBasedRecommendations)(productId, topK);
        res.json({ recommendations, method: 'item-based-cf' });
    }
    catch (error) {
        console.error('Lỗi recommendation item-based:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Hybrid: kết hợp User + Item CF
router.get('/hybrid', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const topK = parseInt(req.query.limit) || 8;
        const recommendations = await (0, recommendation_service_1.getHybridRecommendations)(userId, topK);
        res.json({ recommendations, method: 'hybrid-cf' });
    }
    catch (error) {
        console.error('Lỗi recommendation hybrid:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.default = router;
