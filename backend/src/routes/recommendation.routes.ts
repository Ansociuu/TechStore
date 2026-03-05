import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import {
    getUserBasedRecommendations,
    getItemBasedRecommendations,
    getHybridRecommendations
} from '../services/recommendation.service';

const router = express.Router();

// Gợi ý cho user hiện tại (User-based CF)
router.get('/user', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const topK = parseInt(req.query.limit as string) || 8;
        const recommendations = await getUserBasedRecommendations(userId, topK);
        res.json({ recommendations, method: 'user-based-cf' });
    } catch (error) {
        console.error('Lỗi recommendation user-based:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Sản phẩm thường mua cùng (Item-based CF)
router.get('/item/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const topK = parseInt(req.query.limit as string) || 6;
        const recommendations = await getItemBasedRecommendations(productId, topK);
        res.json({ recommendations, method: 'item-based-cf' });
    } catch (error) {
        console.error('Lỗi recommendation item-based:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Hybrid: kết hợp User + Item CF
router.get('/hybrid', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const topK = parseInt(req.query.limit as string) || 8;
        const recommendations = await getHybridRecommendations(userId, topK);
        res.json({ recommendations, method: 'hybrid-cf' });
    } catch (error) {
        console.error('Lỗi recommendation hybrid:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

export default router;
