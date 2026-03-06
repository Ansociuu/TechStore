import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const userId = 1;
        console.log(`Trying to create cart for user ${userId}`);
        const cart = await prisma.cart.create({
            data: { userId },
            include: { items: { include: { product: true } } }
        });
        console.log('Cart created:', cart);
    } catch (error: any) {
        console.error('CREATE FAILED:', error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

check();
