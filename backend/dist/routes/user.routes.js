"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
// Helper to calculate rank
const calculateRank = (totalSpent) => {
    if (totalSpent >= 50000000)
        return 'Kim Cương';
    if (totalSpent >= 20000000)
        return 'Bạch Kim';
    if (totalSpent >= 5000000)
        return 'Vàng';
    return 'Bạc';
};
// Lấy thông tin chi tiết user bao gồm địa chỉ và cập nhật rank
router.get('/profile', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        // Tính tổng tiền đã chi (chỉ tính đơn hàng đã thanh toán hoặc đã giao)
        const orders = await prisma_1.prisma.order.findMany({
            where: {
                userId,
                status: { in: ['paid', 'delivered', 'shipped'] }
            },
            select: { total: true }
        });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const newRank = calculateRank(totalSpent);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: {
                    orderBy: {
                        isDefault: 'desc'
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        // Cập nhật rank nếu có thay đổi
        if (user.rank !== newRank) {
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { rank: newRank }
            });
            user.rank = newRank;
        }
        // Không trả về password
        const { password, ...userWithoutPassword } = user;
        res.json({ ...userWithoutPassword, totalSpent });
    }
    catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Cập nhật thông tin cá nhân
router.put('/profile', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, birthday, gender, avatar } = req.body;
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                birthday,
                gender,
                avatar
            }
        });
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({ message: 'Cập nhật thông tin thành công', user: userWithoutPassword });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật user:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Đổi mật khẩu
router.post('/change-password', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mật khẩu cũ không chính xác' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({ message: 'Đổi mật khẩu thành công' });
    }
    catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// --- Quản lý địa chỉ ---
// Thêm địa chỉ mới
router.post('/addresses', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, province, district, ward, detail, type, isDefault } = req.body;
        // Nếu đặt làm mặc định, bỏ các địa chỉ mặc định cũ
        if (isDefault) {
            await prisma_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        const address = await prisma_1.prisma.address.create({
            data: {
                userId,
                name,
                phone,
                province,
                district,
                ward,
                detail,
                type,
                isDefault: isDefault || false
            }
        });
        res.status(201).json(address);
    }
    catch (error) {
        console.error('Lỗi khi thêm địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Cập nhật địa chỉ
router.put('/addresses/:id', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const { name, phone, province, district, ward, detail, type, isDefault } = req.body;
        const existingAddress = await prisma_1.prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }
        if (isDefault) {
            await prisma_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        const updatedAddress = await prisma_1.prisma.address.update({
            where: { id },
            data: {
                name,
                phone,
                province,
                district,
                ward,
                detail,
                type,
                isDefault
            }
        });
        res.json(updatedAddress);
    }
    catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Xóa địa chỉ
router.delete('/addresses/:id', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const existingAddress = await prisma_1.prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }
        await prisma_1.prisma.address.delete({ where: { id } });
        res.json({ message: 'Đã xóa địa chỉ thành công' });
    }
    catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Đặt địa chỉ mặc định
router.patch('/addresses/:id/default', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const existingAddress = await prisma_1.prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            }),
            prisma_1.prisma.address.update({
                where: { id },
                data: { isDefault: true }
            })
        ]);
        res.json({ message: 'Đã cập nhật địa chỉ mặc định' });
    }
    catch (error) {
        console.error('Lỗi khi đặt địa chỉ mặc định:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Upload ảnh đại diện
router.post('/upload-avatar', auth_middleware_1.authenticate, cloudinary_1.upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file nào được tải lên' });
        }
        const avatarUrl = req.file.path;
        const userId = req.userId;
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl }
        });
        res.json({ url: avatarUrl, message: 'Cập nhật ảnh đại diện thành công' });
    }
    catch (error) {
        console.error('Lỗi khi upload avatar:', error);
        res.status(500).json({ error: 'Lỗi khi upload ảnh', details: error.message });
    }
});
exports.default = router;
