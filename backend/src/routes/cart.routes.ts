import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Lấy giỏ hàng của user hiện tại
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Nếu chưa có giỏ hàng, tạo mới
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        res.json(cart);
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { productId, quantity = 1 } = req.body;
        console.log(`[Cart/Add] User: ${userId}, Product: ${productId}, Qty: ${quantity}`);

        if (!productId) {
            return res.status(400).json({ error: 'productId là bắt buộc' });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra tồn kho
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Không đủ hàng trong kho' });
        }

        // Lấy hoặc tạo giỏ hàng
        let cart = await prisma.cart.findUnique({ where: { userId } });
        console.log(`[Cart/Add] Found cart:`, cart);
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
            console.log(`[Cart/Add] Created cart:`, cart);
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: Number(productId),
                },
            },
        });
        console.log(`[Cart/Add] Existing item:`, existingItem);

        if (existingItem) {
            // Cập nhật số lượng
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
            res.json(updatedItem);
        } else {
            // Thêm mới
            const newItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity,
                },
                include: { product: true },
            });
            res.json(newItem);
        }
    } catch (error: any) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// Cập nhật số lượng sản phẩm trong giỏ
router.put('/items/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const itemId = Number(req.params.id);
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Số lượng phải lớn hơn 0' });
        }

        // Kiểm tra item có thuộc user không
        const item = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true, product: true },
        });

        if (!item || item.cart.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy item trong giỏ hàng' });
        }

        // Kiểm tra tồn kho
        if (item.product.stock < quantity) {
            return res.status(400).json({ error: 'Không đủ hàng trong kho' });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true },
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/items/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const itemId = Number(req.params.id);

        // Kiểm tra item có thuộc user không
        const item = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });

        if (!item || item.cart.userId !== userId) {
            return res.status(404).json({ error: 'Không tìm thấy item trong giỏ hàng' });
        }

        await prisma.cartItem.delete({ where: { id: itemId } });
        res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Xóa toàn bộ giỏ hàng
router.delete('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Không tìm thấy giỏ hàng' });
        }

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

export default router;
