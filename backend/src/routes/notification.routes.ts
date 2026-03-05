import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Lấy thông báo của user hiện tại
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Đánh dấu một thông báo là đã đọc
router.patch('/:id/read', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const id = req.params.id as string;

        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy thông báo' });
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        res.json(updatedNotification);
    } catch (error) {
        console.error('Lỗi khi cập nhật thông báo:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Đánh dấu tất cả thông báo là đã đọc
router.patch('/read-all', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });

        res.json({ message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
    } catch (error) {
        console.error('Lỗi khi đánh dấu đọc tất cả:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

export default router;
