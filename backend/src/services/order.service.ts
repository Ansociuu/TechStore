import { prisma } from '../lib/prisma';

export const createOrder = async (userId: number, orderData: any) => {
    const { shippingAddress, paymentMethod, items, voucherId, discountAmount } = orderData;

    return await prisma.$transaction(async (tx) => {
        // 1. Kiểm tra tồn kho
        for (const item of items) {
            const productId = Number(item.productId);
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error(`Không tìm thấy sản phẩm ID ${productId}`);
            if (product.stock < item.quantity) throw new Error(`Sản phẩm "${product.name}" không đủ hàng`);
        }

        // 2. Tạo đơn hàng
        const order = await tx.order.create({
            data: {
                userId,
                total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) - (discountAmount || 0),
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
            include: { items: { include: { product: true } } },
        });

        // 3. Giảm tồn kho
        for (const item of items) {
            await tx.product.update({
                where: { id: Number(item.productId) },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // 4. Xóa giỏ hàng
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        // 5. Cập nhật voucher
        if (voucherId) {
            await tx.voucher.update({
                where: { id: Number(voucherId) },
                data: { usageCount: { increment: 1 } }
            });
        }

        // 6. Thông báo Admin
        const admins = await tx.user.findMany({ where: { role: 'admin' } });
        await tx.notification.createMany({
            data: admins.map(admin => ({
                userId: admin.id,
                title: 'Đơn hàng mới',
                message: `Có đơn hàng mới #${order.id}`,
                type: 'order'
            }))
        });

        return order;
    });
};
