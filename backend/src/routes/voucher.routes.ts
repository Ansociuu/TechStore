import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Lấy danh sách voucher khả dụng cho user
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const now = new Date();
        const vouchers = await prisma.voucher.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            }
        });

        // Filter in JS for safe usage limit check
        const availableVouchers = vouchers.filter(v => v.usageLimit === null || v.usageCount < v.usageLimit);

        res.json(availableVouchers);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách voucher' });
    }
});

// Kiểm tra và áp dụng voucher
router.post('/verify', authenticate, async (req: AuthRequest, res) => {
    try {
        const { code, orderTotal } = req.body;
        const now = new Date();

        const voucher = await prisma.voucher.findUnique({
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
        } else {
            discountAmount = voucher.discount;
        }

        res.json({
            voucherId: voucher.id,
            code: voucher.code,
            discountAmount,
            type: voucher.type,
            discount: voucher.discount
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi kiểm tra voucher' });
    }
});

export default router;
