import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    console.log('🧹 Đang dọn dẹp các đơn hàng trống (0 sản phẩm)...');

    // Tìm các đơn hàng không có OrderItem nào
    const emptyOrders = await prisma.order.findMany({
        where: {
            items: { none: {} }
        }
    });

    console.log(`🔍 Tìm thấy ${emptyOrders.length} đơn hàng trống.`);

    if (emptyOrders.length > 0) {
        await prisma.order.deleteMany({
            where: {
                id: { in: emptyOrders.map(o => o.id) }
            }
        });
        console.log('✅ Đã xóa các đơn hàng trống thành công.');
    } else {
        console.log('✨ Không có đơn hàng trống nào cần xóa.');
    }
}
run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
