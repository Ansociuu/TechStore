import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@techstore.com' },
        include: { orders: { include: { items: { include: { product: true } } } } }
    });
    console.log(JSON.stringify(admin?.orders, null, 2));
}
run();
