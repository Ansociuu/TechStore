import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = {};
        if (category && category !== 'all') where.category = String(category);
        if (search) where.name = { contains: String(search) };

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        if (sort === 'price_desc') orderBy = { price: 'desc' };
        if (sort === 'name_asc') orderBy = { name: 'asc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatar: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Thêm sản phẩm mới (Cho Admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    try {
        const product = await prisma.product.create({
            data: { name, description, price, image, category, stock: stock || 0 },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
});

// Cập nhật sản phẩm (Cho Admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, category, stock } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, description, price, image, category, stock },
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
});

// Xóa sản phẩm (Cho Admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: Number(id) } });
        res.json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
});

// Thêm đánh giá cho sản phẩm
router.post('/:id/reviews', authenticate, async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user.userId;

    try {
        // Kiểm tra xem user đã mua sản phẩm này chưa (chỉ đếm đơn hàng không bị huỷ)
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId: Number(id),
                order: {
                    userId,
                    status: {
                        notIn: ['cancelled', 'payment_failed', 'pending'] // Chỉ cho phép đánh giá khi đơn đã xử lý thành công hoặc đang giao/đã giao
                    }
                }
            }
        });

        if (!hasPurchased) {
            return res.status(403).json({ error: 'Bạn chỉ có thể đánh giá sản phẩm đã mua thành công.' });
        }

        // Tạo review
        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                productId: Number(id),
                userId,
            },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });

        // Cập nhật rating và reviewCount cho Product
        const allReviews = await prisma.review.findMany({
            where: { productId: Number(id) }
        });

        const reviewCount = allReviews.length;
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviewCount > 0 ? (totalRating / reviewCount) : 0;

        await prisma.product.update({
            where: { id: Number(id) },
            data: {
                rating: averageRating,
                reviewCount
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ error: 'Lỗi khi gửi đánh giá' });
    }
});

export default router;
