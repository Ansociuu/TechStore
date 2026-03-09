import { Router } from 'express';
import { prisma } from '../index';
import { upload } from '../config/cloudinary';

const router = Router();

// Lấy thống kê Dashboard
router.get('/stats', async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

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

        // Tính toán % tăng trưởng (7 ngày qua so với 7 ngày trước đó)
        const [currentOrders, prevOrders, currentRevenue, prevRevenue, currentUsers, prevUsers] = await Promise.all([
            prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.order.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: sevenDaysAgo }, status: { not: 'cancelled' } }
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo }, status: { not: 'cancelled' } }
            }),
            prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
        ]);

        const calculateGrowth = (current: number, prev: number) => {
            if (prev === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - prev) / prev) * 100);
        };

        const growth = {
            orders: calculateGrowth(currentOrders, prevOrders),
            revenue: calculateGrowth(currentRevenue._sum.total || 0, prevRevenue._sum.total || 0),
            users: calculateGrowth(currentUsers, prevUsers),
        };

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

        // Thống kê doanh thu theo ngày (7 ngày qua)
        const ordersLast7Days = await prisma.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true, total: true },
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

        // Thống kê theo danh mục
        const categories = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                id: true,
            },
        });
        const categoryDistribution = categories.map(c => ({
            name: c.category,
            count: c._count.id,
        }));

        // Top sản phẩm bán chạy (theo số lượng đã bán)
        const topProductsRaw = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        });

        const topProducts = await Promise.all(
            topProductsRaw.map(async (tp) => {
                const product = await prisma.product.findUnique({
                    where: { id: tp.productId },
                    select: { name: true, image: true, price: true },
                });
                return {
                    ...product,
                    sold: tp._sum.quantity,
                };
            })
        );

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            totalStock,
            recentOrders,
            salesByDay,
            lowStockProducts,
            categoryDistribution,
            topProducts,
            growth,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thống kê' });
    }
});

// Quản lý người dùng: Lấy danh sách
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [users, total] = await Promise.all([
            prisma.user.findMany({
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
                skip,
                take,
            }),
            prisma.user.count(),
        ]);

        res.json({
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
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

// Quản lý người dùng: Xóa hàng loạt
router.post('/users/bulk-delete', async (req, res) => {
    const { ids } = req.body;
    try {
        await prisma.user.deleteMany({
            where: {
                id: { in: ids.map((id: any) => Number(id)) }
            },
        });
        res.json({ message: 'Đã xóa hàng loạt người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa hàng loạt người dùng' });
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

// Quản lý Voucher: Lấy danh sách
router.get('/vouchers', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [vouchers, total] = await Promise.all([
            prisma.voucher.findMany({
                where: {
                    OR: [
                        { code: { contains: String(search) } },
                    ]
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            prisma.voucher.count({
                where: {
                    OR: [
                        { code: { contains: String(search) } },
                    ]
                }
            }),
        ]);

        res.json({
            vouchers,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách voucher' });
    }
});

// Quản lý Voucher: Thêm mới
router.post('/vouchers', async (req, res) => {
    try {
        const voucher = await prisma.voucher.create({
            data: {
                ...req.body,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
            },
        });
        res.status(201).json(voucher);
    } catch (error) {
        console.error('Create voucher error:', error);
        res.status(500).json({ error: 'Lỗi khi tạo voucher' });
    }
});

// Quản lý Voucher: Cập nhật
router.put('/vouchers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await prisma.voucher.update({
            where: { id: Number(id) },
            data: {
                ...req.body,
                startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            },
        });
        res.json(voucher);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật voucher' });
    }
});

// Quản lý Voucher: Xóa
router.delete('/vouchers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.voucher.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Đã xóa voucher thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa voucher' });
    }
});

// Quản lý Voucher: Xóa hàng loạt
router.post('/vouchers/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        await prisma.voucher.deleteMany({
            where: {
                id: { in: ids.map((id: any) => Number(id)) }
            },
        });
        res.json({ message: 'Đã xóa hàng loạt voucher thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa hàng loạt voucher' });
    }
});

// Quản lý Đánh giá: Lấy danh sách
router.get('/reviews', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', rating } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = {
            OR: [
                { comment: { contains: String(search) } },
            ]
        };

        if (rating) {
            where.rating = Number(rating);
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            avatar: true,
                        }
                    },
                    product: {
                        select: {
                            name: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            prisma.review.count({ where }),
        ]);

        res.json({
            reviews,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đánh giá' });
    }
});

// Quản lý Đánh giá: Xóa
router.delete('/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.review.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Đã xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa đánh giá' });
    }
});

// Quản lý Đánh giá: Xóa hàng loạt
router.post('/reviews/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        await prisma.review.deleteMany({
            where: {
                id: { in: ids.map((id: any) => Number(id)) }
            },
        });
        res.json({ message: 'Đã xóa hàng loạt đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa hàng loạt đánh giá' });
    }
});

export default router;
