import { Router } from 'express';
import { prisma } from '../index';
import { upload } from '../config/cloudinary';

const router = Router();

// Lấy thống kê Dashboard
router.get('/stats', async (req, res) => {
    try {
        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();
        const totalUsers = await prisma.user.count();

        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: {
                    not: 'cancelled',
                },
            },
        });
        const totalRevenue = revenueResult._sum.total || 0;

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Thống kê 7 ngày gần đây
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const ordersLast7Days = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                createdAt: true,
                total: true,
            },
        });

        // Nhóm dữ liệu theo ngày
        const salesByDay = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

            const dayOrders = ordersLast7Days.filter(o =>
                new Date(o.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) === dateStr
            );

            return {
                date: dateStr,
                count: dayOrders.length,
                revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
            };
        }).reverse();

        // Thống kê tồn kho
        const inventoryResult = await prisma.product.aggregate({
            _sum: {
                stock: true,
            },
        });
        const totalStock = inventoryResult._sum.stock || 0;

        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lt: 10, // Ngưỡng sắp hết hàng là 10
                },
            },
            take: 10,
            orderBy: {
                stock: 'asc',
            },
        });

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            totalStock,
            recentOrders,
            salesByDay,
            lowStockProducts,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thống kê' });
    }
});

// Quản lý người dùng: Lấy danh sách
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
    }
});

// Quản lý người dùng: Cập nhật vai trò
router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật vai trò' });
    }
});

// Quản lý người dùng: Xóa người dùng
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Đã xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa người dùng' });
    }
});

// Upload ảnh sản phẩm
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file nào được tải lên' });
        }
        res.json({ url: (req.file as any).path });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Lỗi khi upload ảnh' });
    }
});

export default router;
