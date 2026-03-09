import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { getProducts, getProductById } from '../services/product.service';

const router = Router();

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const result = await getProducts(req.query);
        res.json(result);
    } catch (error: any) {
        console.error('Fetch products error:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm', details: error.message });
    }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await getProductById(id);
        if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error: any) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ error: 'Lỗi server', details: error.message });
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

// Xóa hàng loạt sản phẩm (Cho Admin)
router.post('/bulk-delete', authenticate, requireAdmin, async (req, res) => {
    const { ids } = req.body; // Array of numbers
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
    }
    try {
        await prisma.product.deleteMany({
            where: {
                id: {
                    in: ids.map(id => Number(id))
                }
            }
        });
        res.json({ message: 'Đã xóa hàng loạt sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa hàng loạt sản phẩm' });
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
