import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const items = await prisma.cartItem.findMany();
        console.log('CartItems:', items.length);
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                console.error(`Orphaned CartItem found: ID ${item.id}, ProductID ${item.productId}`);
            }
        }
    } catch (error) {
        console.error('Integrity check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
