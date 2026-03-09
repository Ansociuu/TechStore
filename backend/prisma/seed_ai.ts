import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🤖 Bắt đầu tạo dữ liệu Seed cho AI Recommendation...');

    // 1. Tạo 20 người dùng giả lập
    const password = await bcrypt.hash('bot123', 10);
    const users = [];
    for (let i = 1; i <= 25; i++) {
        const email = `bot_user_${i}@test.com`;
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password,
                name: `Khách Hàng Bot ${i} `,
                role: 'user',
            },
        });
        users.push(user);
    }
    console.log(`✅ Đã tạo / cập nhật ${users.length} người dùng bot.`);

    // 2. Lấy danh sách sản phẩm hiện có
    const allProducts = await prisma.product.findMany();
    if (allProducts.length === 0) {
        console.error('❌ Không tìm thấy sản phẩm nào trong database. Vui lòng chạy seed chính trước.');
        return;
    }

    const findProduct = (name: string) => allProducts.find(p => p.name.toLowerCase().includes(name.toLowerCase()));

    const iphone = findProduct('iPhone');
    const macbookAir = findProduct('MacBook Air');
    const macbookPro = findProduct('MacBook Pro');
    const dellXps = findProduct('Dell XPS');
    const sonyHeadphone = findProduct('Sony WH');
    const marshallSpeaker = findProduct('Marshall');
    const appleWatch = findProduct('Apple Watch');
    const ipad16 = findProduct('iPad A16');
    const teclastM50 = findProduct('Teclast M50');
    const pdkb = findProduct('bao da iPad Air');

    // 3. Tạo các mẫu mua sắm (Shopping Patterns)
    console.log('📦 Đang tạo các đơn hàng mẫu...');

    const createOrder = async (userId: number, products: any[]) => {
        const total = products.reduce((sum, p) => sum + p.price, 0);
        return prisma.order.create({
            data: {
                userId,
                total,
                status: 'delivered',
                shippingAddress: 'Dữ liệu bot seed',
                paymentMethod: 'cod',
                items: {
                    create: products.map(p => ({
                        productId: p.id,
                        quantity: 1,
                        price: p.price
                    }))
                }
            }
        });
    };

    // Nhóm 1: Apple Ecosystem (User 1-5)
    if (iphone && appleWatch && macbookAir) {
        for (let i = 0; i < 5; i++) {
            await createOrder(users[i].id, [iphone, appleWatch]);
            if (i % 2 === 0) await createOrder(users[i].id, [macbookAir]);
        }
    }

    // Nhóm 2: High-end & Audio (User 6-10)
    if (sonyHeadphone && marshallSpeaker && macbookPro) {
        for (let i = 5; i < 10; i++) {
            await createOrder(users[i].id, [sonyHeadphone, marshallSpeaker]);
            if (i % 2 === 0) await createOrder(users[i].id, [macbookPro]);
        }
    }

    // Nhóm 3: Windows & Variety (User 11-15)
    if (dellXps && sonyHeadphone) {
        for (let i = 10; i < 15; i++) {
            await createOrder(users[i].id, [dellXps]);
            await createOrder(users[i].id, [sonyHeadphone]);
        }
    }

    // Nhóm 4: Random Samples (User 16-20)
    for (let i = 15; i < 20; i++) {
        const randomProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 2);
        await createOrder(users[i].id, randomProducts);
    }

    // Nhóm 5: Tablets & Accessories (User 21-25)
    if (ipad16 || teclastM50 || pdkb) {
        for (let i = 20; i < 25; i++) {
            const products = [];
            if (ipad16 && i % 2 === 0) products.push(ipad16);
            if (teclastM50 && i % 2 !== 0) products.push(teclastM50);
            if (pdkb) products.push(pdkb);
            if (products.length > 0) {
                await createOrder(users[i].id, products);
            }
        }
    }

    console.log('🎉 Đã tạo dữ liệu đơn hàng mẫu thành công!');
    console.log('🚀 AI Recommendation hiện đã có đủ dữ liệu để tính toán độ tương đồng (Collaborative Filtering).');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
