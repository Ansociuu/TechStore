import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.order.count();
        console.log('Orders count:', count);
        const firstOrder = await prisma.order.findFirst();
        console.log('First order:', firstOrder);
    } catch (error) {
        console.error('Order check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
