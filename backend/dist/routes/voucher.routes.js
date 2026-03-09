"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Lấy danh sách voucher khả dụng cho user
router.get('/', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const now = new Date();
        const vouchers = await prisma_1.prisma.voucher.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            }
        });
        // Filter in JS for safe usage limit check
        const availableVouchers = vouchers.filter(v => v.usageLimit === null || v.usageCount < v.usageLimit);
        res.json(availableVouchers);
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách voucher' });
    }
});
// Kiểm tra và áp dụng voucher
router.post('/verify', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        const now = new Date();
        const voucher = await prisma_1.prisma.voucher.findUnique({
            where: { code }
        });
        if (!voucher) {
            return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
        }
        if (!voucher.isActive || voucher.startDate > now || voucher.endDate < now) {
            return res.status(400).json({ error: 'Mã giảm giá đã hết hạn hoặc không còn hiệu lực' });
        }
        if (voucher.usageLimit !== null && voucher.usageCount >= voucher.usageLimit) {
            return res.status(400).json({ error: 'Mã giảm giá đã hết lượt sử dụng' });
        }
        if (voucher.minOrder && orderTotal < voucher.minOrder) {
            return res.status(400).json({
                error: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này`
            });
        }
        let discountAmount = 0;
        if (voucher.type === 'percentage') {
            discountAmount = (orderTotal * voucher.discount) / 100;
            if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                discountAmount = voucher.maxDiscount;
            }
        }
        else {
            discountAmount = voucher.discount;
        }
        res.json({
            voucherId: voucher.id,
            code: voucher.code,
            discountAmount,
            type: voucher.type,
            discount: voucher.discount
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi khi kiểm tra voucher' });
    }
});
exports.default = router;
