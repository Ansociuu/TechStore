"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const momoService_1 = require("../services/momoService");
const validation_middleware_1 = require("../middleware/validation.middleware");
const schemas_1 = require("../middleware/schemas");
const order_service_1 = require("../services/order.service");
const router = express_1.default.Router();
// Tạo đơn hàng mới từ cart items trong request
router.post('/', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(schemas_1.orderSchema), async (req, res) => {
    try {
        const userId = req.userId;
        const order = await (0, order_service_1.createOrder)(userId, req.body);
        console.log('[Order] Created successfully:', order.id);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(400).json({ error: error.message || 'Lỗi khi tạo đơn hàng' });
    }
});
// Lấy danh sách đơn hàng của user hiện tại
router.get('/', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await prisma_1.prisma.order.findMany({
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
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Lấy chi tiết đơn hàng
router.get('/:id', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = Number(req.params.id);
        const order = await prisma_1.prisma.order.findUnique({
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
    }
    catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Cập nhật trạng thái đơn hàng (Admin only)
router.put('/:id/status', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
        }
        const order = await prisma_1.prisma.order.update({
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
        const statusMap = {
            'pending': 'đang chờ xử lý',
            'processing': 'đang được chuẩn bị',
            'shipped': 'đang được giao',
            'delivered': 'đã giao thành công',
            'cancelled': 'đã bị hủy'
        };
        await prisma_1.prisma.notification.create({
            data: {
                userId: order.userId,
                title: 'Cập nhật đơn hàng',
                message: `Đơn hàng #${order.id} của bạn ${statusMap[status] || status}.`,
                type: 'order'
            }
        });
        res.json(order);
    }
    catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
// Lấy tất cả đơn hàng (Admin only)
router.get('/admin/all', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const [orders, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
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
            prisma_1.prisma.order.count(),
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
    }
    catch (error) {
        console.error('Lỗi khi lấy tất cả đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi khi lấy tất cả đơn hàng', details: error.message });
    }
});
// Tạo URL thanh toán MoMo cho đơn hàng
router.post('/:id/create-momo-url', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });
        if (!order)
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        if (order.status === 'paid')
            return res.status(400).json({ error: 'Đơn hàng đã được thanh toán' });
        const result = await (0, momoService_1.createMomoPaymentUrl)({
            amount: order.total,
            orderId: String(order.id),
            orderInfo: `Thanh toán đơn hàng #${order.id} tại TechStore`,
            requestId: `REQ_${order.id}_${Date.now()}`,
        });
        res.json({ payUrl: result.payUrl });
    }
    catch (error) {
        console.error('Lỗi tạo URL MoMo:', error);
        res.status(500).json({ error: error.message || 'Lỗi khi tạo liên kết thanh toán MoMo' });
    }
});
// Xử lý MoMo IPN (MoMo Server gọi trực tiếp)
router.post('/momo-ipn', async (req, res) => {
    try {
        console.log('MoMo IPN received:', req.body);
        const isValid = (0, momoService_1.verifyMomoSignature)(req.body);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid signature' });
        }
        const { orderId, resultCode } = req.body;
        const id = Number(orderId);
        if (resultCode === 0) {
            // Thanh toán thành công
            await prisma_1.prisma.order.update({
                where: { id },
                data: { status: 'paid' }
            });
        }
        else {
            // Thanh toán thất bại hoặc hủy
            await prisma_1.prisma.order.update({
                where: { id },
                data: { status: 'payment_failed' }
            });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Lỗi xử lý MoMo IPN:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
