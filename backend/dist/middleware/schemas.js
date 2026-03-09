"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemSchema = exports.orderSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        name: zod_1.z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(1, 'Mật khẩu là bắt buộc'),
    }),
});
exports.orderSchema = zod_1.z.object({
    body: zod_1.z.object({
        shippingAddress: zod_1.z.string().min(10, 'Địa chỉ giao hàng quá ngắn'),
        paymentMethod: zod_1.z.enum(['cod', 'momo', 'banking', 'visa']),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.coerce.number(),
            quantity: zod_1.z.number().positive(),
            price: zod_1.z.number().positive(),
        })).min(1, 'Giỏ hàng không được để trống'),
        voucherId: zod_1.z.coerce.number().nullable().optional(),
        discountAmount: zod_1.z.number().optional().default(0),
    }),
});
exports.cartItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.number(),
        quantity: zod_1.z.number().positive('Số lượng phải lớn hơn 0').optional().default(1),
    }),
});
