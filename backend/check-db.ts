import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        await prisma.$connect();
        console.log('Connected to DB');
        const users = await prisma.user.count();
        console.log('Users:', users);
        const vouchers = await prisma.voucher.count();
        console.log('Vouchers:', vouchers);
        const carts = await prisma.cart.count();
        console.log('Carts:', carts);
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
