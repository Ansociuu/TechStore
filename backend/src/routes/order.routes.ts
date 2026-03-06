import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth.middleware';
import { createMomoPaymentUrl, verifyMomoSignature } from '../services/momoService';

const router = express.Router();

// Tạo đơn hàng mới từ cart items trong request
router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { shippingAddress, paymentMethod, items, voucherId, discountAmount } = req.body;
        console.log('[Order] Request Body:', JSON.stringify(req.body, null, 2));

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.warn('[Order] Empty items array');
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Kiểm tra tồn kho cho tất cả items
            for (const item of items) {
                const productId = Number(item.productId);
                const product = await tx.product.findUnique({ where: { id: productId } });
                if (!product) {
                    throw new Error(`Không tìm thấy sản phẩm ID ${productId}`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Sản phẩm "${product.name}" không đủ hàng trong kho`);
                }
            }

            // 2. Tạo đơn hàng
            const order = await tx.order.create({
                data: {
                    userId,
                    total: items.reduce((sum: number, item: any) => {
                        const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
                        console.log(`[Order] Item Product ${item.productId}: Price: ${item.price}, Qty: ${item.quantity}, Line total: ${lineTotal}`);
                        return sum + lineTotal;
                    }, 0) - (Number(discountAmount) || 0),
                    status: 'pending',
                    shippingAddress,
                    paymentMethod,
                    voucherId: voucherId ? Number(voucherId) : null,
                    discountAmount: Number(discountAmount) || 0,
                    items: {
                        create: items.map((item: any) => ({
                            productId: Number(item.productId),
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // 3. Giảm tồn kho
            for (const item of items) {
                await tx.product.update({
                    where: { id: Number(item.productId) },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // 4. Xóa toàn bộ giỏ hàng
            const cart = await tx.cart.findUnique({ where: { userId } });
            console.log(`[Order] Found cart for clearing:`, cart?.id);
            if (cart) {
                const deleted = await tx.cartItem.deleteMany({
                    where: { cartId: cart.id }
                });
                console.log(`[Order] Deleted ${deleted.count} items from cart ${cart.id}`);
            }

            // 5. Cập nhật lượt sử dụng voucher
            if (voucherId) {
                await tx.voucher.update({
                    where: { id: Number(voucherId) },
                    data: {
                        usageCount: { increment: 1 }
                    }
                });
                console.log(`[Order] Voucher ${voucherId} usage count incremented`);
            }

            // 6. Thông báo cho Admin
            const admins = await tx.user.findMany({ where: { role: 'admin' } });
            await tx.notification.createMany({
                data: admins.map(admin => ({
                    userId: admin.id,
                    title: 'Đơn hàng mới',
                    message: `Có đơn hàng mới #${order.id} từ khách hàng ${req.userId}`,
                    type: 'order'
                }))
            });

            return order;
        });

        console.log('[Order] Created successfully:', result.id);

        res.status(201).json(result);
    } catch (error: any) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(400).json({ error: error.message || 'Lỗi khi tạo đơn hàng' });
    }
});

// Lấy tất cả đơn hàng (Admin)
router.get('/admin/all', authenticate, async (req: AuthRequest, res) => {
    try {
        // TODO: Check if user is admin req.user?.role === 'admin'
        const orders = await prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
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

// Lấy tất cả đơn hàng (Admin only)
router.get('/admin/all', authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
        const orders = await prisma.order.findMany({
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
        });

        res.json(orders);
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
