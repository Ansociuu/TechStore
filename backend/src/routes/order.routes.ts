import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth.middleware';
import { createMomoPaymentUrl, verifyMomoSignature } from '../services/momoService';
import { validate } from '../middleware/validation.middleware';
import { orderSchema } from '../middleware/schemas';

import { createOrder } from '../services/order.service';

const router = express.Router();

// Tạo đơn hàng mới từ cart items trong request
router.post('/', authenticate, validate(orderSchema), async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const order = await createOrder(userId, req.body);
        console.log('[Order] Created successfully:', order.id);
        res.status(201).json(order);
    } catch (error: any) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(400).json({ error: error.message || 'Lỗi khi tạo đơn hàng' });
    }
});


// Lấy danh sách đơn hàng của user hiện tại
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Lấy chi tiết đơn hàng
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const orderId = Number(req.params.id);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        // Chỉ cho phép user xem đơn hàng của mình hoặc admin xem tất cả
        if (order.userId !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền truy cập đơn hàng này' });
        }

        res.json(order);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Cập nhật trạng thái đơn hàng (Admin only)
router.put('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
        const orderId = Number(req.params.id);
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true
            },
        });

        // Thông báo cho người dùng về việc cập nhật trạng thái
        const statusMap: Record<string, string> = {
            'pending': 'đang chờ xử lý',
            'processing': 'đang được chuẩn bị',
            'shipped': 'đang được giao',
            'delivered': 'đã giao thành công',
            'cancelled': 'đã bị hủy'
        };

        await prisma.notification.create({
            data: {
                userId: order.userId,
                title: 'Cập nhật đơn hàng',
                message: `Đơn hàng #${order.id} của bạn ${statusMap[status] || status}.`,
                type: 'order'
            }
        });

        res.json(order);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Khách hàng tự hủy đơn hàng (chỉ áp dụng cho đơn 'pending')
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.userId!;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ error: 'Không có quyền hủy đơn hàng này' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        });

        // Thông báo cho người dùng
        await prisma.notification.create({
            data: {
                userId: updatedOrder.userId,
                title: 'Hủy đơn hàng thành công',
                message: `Đơn hàng #${updatedOrder.id} của bạn đã được hủy thành công.`,
                type: 'order'
            }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Lấy tất cả đơn hàng (Admin only)
router.get('/admin/all', authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.order.count(),
        ]);

        res.json({
            orders,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        console.error('Lỗi khi lấy tất cả đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi khi lấy tất cả đơn hàng', details: error.message });
    }
});

// Tạo URL thanh toán MoMo cho đơn hàng
router.post('/:id/create-momo-url', authenticate, async (req: AuthRequest, res) => {
    try {
        const orderId = Number(req.params.id);
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        if (order.status === 'paid') return res.status(400).json({ error: 'Đơn hàng đã được thanh toán' });

        const result = await createMomoPaymentUrl({
            amount: order.total,
            orderId: String(order.id),
            orderInfo: `Thanh toán đơn hàng #${order.id} tại TechStore`,
            requestId: `REQ_${order.id}_${Date.now()}`,
        });

        res.json({ payUrl: result.payUrl });
    } catch (error: any) {
        console.error('Lỗi tạo URL MoMo:', error);
        res.status(500).json({ error: error.message || 'Lỗi khi tạo liên kết thanh toán MoMo' });
    }
});

// Xử lý MoMo IPN (MoMo Server gọi trực tiếp)
router.post('/momo-ipn', async (req, res) => {
    try {
        console.log('MoMo IPN received:', req.body);
        const isValid = verifyMomoSignature(req.body);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const { orderId, resultCode } = req.body;
        const id = Number(orderId);

        if (resultCode === 0) {
            // Thanh toán thành công
            await prisma.order.update({
                where: { id },
                data: { status: 'paid' }
            });
        } else {
            // Thanh toán thất bại hoặc hủy
            await prisma.order.update({
                where: { id },
                data: { status: 'payment_failed' }
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Lỗi xử lý MoMo IPN:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
