import express from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Lấy thông tin chi tiết user bao gồm địa chỉ
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const user = await prisma.user.findUnique({
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

        // Không trả về password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Cập nhật thông tin cá nhân
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { name, phone, birthday, gender, avatar } = req.body;

        const updatedUser = await prisma.user.update({
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
    } catch (error) {
        console.error('Lỗi khi cập nhật user:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- Quản lý địa chỉ ---

// Thêm địa chỉ mới
router.post('/addresses', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { name, phone, province, district, ward, detail, type, isDefault } = req.body;

        // Nếu đặt làm mặc định, bỏ các địa chỉ mặc định cũ
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
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
    } catch (error) {
        console.error('Lỗi khi thêm địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Cập nhật địa chỉ
router.put('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const id = req.params.id as string;
        const { name, phone, province, district, ward, detail, type, isDefault } = req.body;

        const existingAddress = await prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const updatedAddress = await prisma.address.update({
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
    } catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Xóa địa chỉ
router.delete('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const id = req.params.id as string;
        const existingAddress = await prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }

        await prisma.address.delete({ where: { id } });
        res.json({ message: 'Đã xóa địa chỉ thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Đặt địa chỉ mặc định
router.patch('/addresses/:id/default', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const id = req.params.id as string;
        const existingAddress = await prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
        }

        await prisma.$transaction([
            prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            }),
            prisma.address.update({
                where: { id },
                data: { isDefault: true }
            })
        ]);

        res.json({ message: 'Đã cập nhật địa chỉ mặc định' });
    } catch (error) {
        console.error('Lỗi khi đặt địa chỉ mặc định:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

export default router;
