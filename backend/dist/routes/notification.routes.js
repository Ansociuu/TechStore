"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Lấy thông báo của user hiện tại
router.get('/', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    }
    catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Đánh dấu một thông báo là đã đọc
router.patch('/:id/read', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy thông báo' });
        }
        const updatedNotification = await prisma_1.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        res.json(updatedNotification);
    }
    catch (error) {
        console.error('Lỗi khi cập nhật thông báo:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Đánh dấu tất cả thông báo là đã đọc
router.patch('/read-all', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        await prisma_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        res.json({ message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
    }
    catch (error) {
        console.error('Lỗi khi đánh dấu đọc tất cả:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.default = router;
