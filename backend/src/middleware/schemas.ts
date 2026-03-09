import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(1, 'Mật khẩu là bắt buộc'),
    }),
});

export const orderSchema = z.object({
    body: z.object({
        shippingAddress: z.string().min(10, 'Địa chỉ giao hàng quá ngắn'),
        paymentMethod: z.enum(['cod', 'momo', 'banking', 'visa']),
        items: z.array(z.object({
            productId: z.coerce.number(),
            quantity: z.number().positive(),
            price: z.number().positive(),
        })).min(1, 'Giỏ hàng không được để trống'),
        voucherId: z.coerce.number().nullable().optional(),
        discountAmount: z.number().optional().default(0),
    }),
});

export const cartItemSchema = z.object({
    body: z.object({
        productId: z.number(),
        quantity: z.number().positive('Số lượng phải lớn hơn 0').optional().default(1),
    }),
});
