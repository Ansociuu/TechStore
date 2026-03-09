import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get wishlist
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const wishlist = await prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(wishlist.map(item => item.product));
    } catch (error) {
        console.error('Failed to get wishlist:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Add to wishlist
router.post('/:productId', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const productId = Number(req.params.productId);

        const exists = await prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (exists) {
            return res.json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
        }

        const wishItem = await prisma.wishlist.create({
            data: { userId, productId },
            include: { product: true }
        });

        res.status(201).json({ message: 'Đã thêm vào yêu thích', product: wishItem.product });
    } catch (error) {
        console.error('Failed to add to wishlist:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Remove from wishlist
router.delete('/:productId', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const productId = Number(req.params.productId);

        await prisma.wishlist.delete({
            where: {
                userId_productId: { userId, productId }
            }
        });

        res.json({ message: 'Đã xóa khỏi yêu thích' });
    } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Toggle wishlist
router.post('/:productId/toggle', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const productId = Number(req.params.productId);

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid Product ID' });
        }

        const exists = await prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (exists) {
            await prisma.wishlist.delete({
                where: {
                    userId_productId: { userId, productId }
                }
            });
            return res.json({ status: 'removed', message: 'Đã xóa khỏi danh sách yêu thích' });
        } else {
            await prisma.wishlist.create({
                data: { userId, productId }
            });
            return res.json({ status: 'added', message: 'Đã thêm vào danh sách yêu thích' });
        }
    } catch (error) {
        console.error('Failed to toggle wishlist:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

export default router;
