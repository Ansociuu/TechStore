import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const users = await prisma.user.findMany({ select: { id: true, email: true } });
        console.log('Current Users:', users);
    } catch (error: any) {
        console.error('Check failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
