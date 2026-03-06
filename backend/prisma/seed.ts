import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Hàm tạo URL ảnh AI dựa trên tên sản phẩm
// Sử dụng Pollinations.ai để tạo ảnh thực tế (photorealistic)
const getAIImage = (name: string, category: string): string => {
    const prompt = encodeURIComponent(`${name} ${category} product, professional studio photography, highly detailed, 4k, white background`);
    // Thêm tham số nologo để tránh logo AI, seed ngẫu nhiên để ảnh không bị trùng hoàn toàn nếu tên giống nhau
    const randomSeed = Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=800&nologo=true&seed=${randomSeed}&model=flux`;
};

async function main() {
    console.log('🌱 Bắt đầu seed data...');

    // // Xóa dữ liệu cũ để tránh trùng lặp
    // console.log('🗑️  Xóa dữ liệu cũ...');
    // await prisma.cartItem.deleteMany();
    // await prisma.cart.deleteMany();
    // await prisma.orderItem.deleteMany();
    // await prisma.order.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.user.deleteMany();
    // await prisma.voucher.deleteMany(); 

    // Tạo tài khoản Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@techstore.com' },
        update: { password: adminPassword }, // Cập nhật pass mới nếu có
        create: {
            email: 'admin@techstore.com',
            password: adminPassword,
            name: 'Admin TechStore',
            role: 'admin',
        },
    });
    console.log('✅ TechStore Admin:', admin.email);

    // Tạo tài khoản User mẫu
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@techstore.com' },
        update: { password: userPassword },
        create: {
            email: 'user@techstore.com',
            password: userPassword,
            name: 'Nguyễn Văn A',
            role: 'user',
        },
    });
    console.log('✅ Tài khoản mẫu:', user.email);

    // Danh sách sản phẩm đa dạng với thông số thật
    const products = [
        // Laptop
        {
            name: 'MacBook Air M2',
            price: 28990000,
            category: 'Laptop',
            stock: 15,
            description: 'Siêu mỏng nhẹ, chip M2 mạnh mẽ, màn hình Liquid Retina 13.6 inch.',
            rating: 4.8,
            reviewCount: 124,
            isHot: true,
            isNew: false,
            originalPrice: 32990000,
            specs: {
                'CPU': 'Apple M2 8-core',
                'RAM': '8GB Unified Memory',
                'Ổ cứng': '256GB SSD',
                'Màn hình': '13.6" Liquid Retina',
                'Trọng lượng': '1.24 kg'
            }
        },
        {
            name: 'MacBook Pro 14 M3',
            price: 39990000,
            category: 'Laptop',
            stock: 10,
            description: 'Hiệu năng chuyên nghiệp với chip M3 Pro, màn hình XDR 120Hz.',
            rating: 4.9,
            reviewCount: 85,
            isHot: true,
            isNew: true,
            originalPrice: 44990000,
            specs: {
                'CPU': 'Apple M3 Pro 11-core',
                'RAM': '18GB Unified Memory',
                'Ổ cứng': '512GB SSD',
                'Màn hình': '14.2" Liquid Retina XDR',
                'Tần số quét': '120Hz (ProMotion)'
            }
        },
        {
            name: 'Dell XPS 13 Plus',
            price: 42000000,
            category: 'Laptop',
            stock: 8,
            description: 'Thiết kế tương lai, màn hình OLED 3.5K, bàn phím vô cực.',
            rating: 4.6,
            reviewCount: 42,
            isHot: false,
            isNew: true,
            originalPrice: 45000000,
            specs: {
                'CPU': 'Intel Core i7-1360P',
                'RAM': '16GB LPDDR5',
                'Ổ cứng': '512GB Gen 4 SSD',
                'Màn hình': '13.4" 3.5K OLED Touch',
                'Hệ điều hành': 'Windows 11 Home'
            }
        },

        // Smartphone
        {
            name: 'iPhone 16 Pro Max',
            price: 34990000,
            category: 'Smartphone',
            stock: 20,
            description: 'Titan Tự Nhiên, Chip A18 Pro, Camera 48MP zoom 5x.',
            rating: 4.9,
            reviewCount: 560,
            isHot: true,
            isNew: true,
            originalPrice: 36990000,
            specs: {
                'Màn hình': '6.9" Super Retina XDR',
                'Chip': 'A18 Pro',
                'Camera sau': '48MP + 48MP + 12MP',
                'Pin': 'Lên đến 33 giờ xem video',
                'Cổng kết nối': 'USB-C (USB 3)'
            }
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            price: 29990000,
            category: 'Smartphone',
            stock: 18,
            description: 'Màn hình phẳng, khung Titan, Galaxy AI, bút S Pen quyền năng.',
            rating: 4.7,
            reviewCount: 320,
            isHot: true,
            isNew: false,
            originalPrice: 33900000,
            specs: {
                'Màn hình': '6.8" Dynamic AMOLED 2X',
                'Chip': 'Snapdragon 8 Gen 3 for Galaxy',
                'RAM': '12GB',
                'Camera': '200MP + 50MP + 12MP + 10MP',
                'Pin': '5,000 mAh'
            }
        },
        {
            name: 'Sony WH-1000XM5',
            price: 8990000,
            category: 'Âm thanh',
            stock: 22,
            description: 'Tai nghe chống ồn tốt nhất thế giới, thiết kế mới nhẹ nhàng.',
            rating: 4.8,
            reviewCount: 215,
            isHot: true,
            isNew: false,
            originalPrice: 9990000,
            specs: {
                'Loại': 'Over-ear',
                'Chống ồn': 'Active Noise Cancellation (ANC)',
                'Pin': '30 giờ (bật ANC)',
                'Kết nối': 'Bluetooth 5.2, Jack 3.5mm',
                'Trình điều khiển': '30mm'
            }
        },
        {
            name: 'Marshall Stanmore III',
            price: 9500000,
            category: 'Âm thanh',
            stock: 10,
            description: 'Loa Bluetooth phong cách cổ điển, âm thanh uy lực tràn ngập căn phòng.',
            rating: 4.9,
            reviewCount: 78,
            isHot: false,
            isNew: true,
            originalPrice: 10500000,
            specs: {
                'Công suất': '80W',
                'Kết nối': 'Bluetooth 5.2, AUX, RCA',
                'Dải tần': '45–20,000 Hz',
                'Trọng lượng': '4.25 kg'
            }
        },
        {
            name: 'Apple Watch Ultra 2',
            price: 21990000,
            category: 'Smartwatch',
            stock: 10,
            description: 'Đồng hồ thể thao bền bỉ nhất, màn hình sáng nhất 3000 nits.',
            rating: 4.9,
            reviewCount: 154,
            isHot: true,
            isNew: false,
            originalPrice: 23990000,
            specs: {
                'Vỏ': 'Titanium 49mm',
                'Màn hình': 'LTPO OLED 3000 nits',
                'Pin': 'Lên đến 36 giờ (chế độ thường)',
                'Chống nước': '100m (WR100)',
                'GPS': 'Dual-frequency GPS'
            }
        }
    ];

    console.log(`🚀 Đang tạo ${products.length} sản phẩm thực tế...`);

    for (const [index, p] of products.entries()) {
        await prisma.product.create({
            data: {
                name: p.name,
                description: p.description,
                price: p.price,
                originalPrice: p.originalPrice,
                stock: p.stock,
                category: p.category,
                image: getAIImage(p.name, p.category),
                rating: p.rating,
                reviewCount: p.reviewCount,
                isHot: p.isHot,
                isNew: p.isNew,
                specs: p.specs as any,
            },
        });
        console.log(`[${index + 1}/${products.length}] ✅ Đã tạo: ${p.name}`);
    }

    // Tạo Voucher mẫu
    console.log('🎟️  Tạo Voucher...');
    const voucherData = [
        {
            code: 'TECHSTORE10',
            discount: 10,
            type: 'percentage',
            minOrder: 1000000,
            maxDiscount: 500000,
            endDate: new Date('2026-12-31'),
            usageLimit: 100
        },
        {
            code: 'HELLOSPRING',
            discount: 200000,
            type: 'fixed',
            minOrder: 5000000,
            endDate: new Date('2026-06-30'),
            usageLimit: 50
        },
        {
            code: 'FREESHIP',
            discount: 50000,
            type: 'fixed',
            minOrder: 0,
            endDate: new Date('2026-12-31'),
            usageLimit: null
        }
    ];

    for (const v of voucherData) {
        await prisma.voucher.upsert({
            where: { code: v.code },
            update: v,
            create: v
        });
    }
    console.log('✅ Đã tạo/cập nhật các Voucher mẫu');

    console.log('🎉 Seed data hoàn tất!');
    console.log('\n📝 Thông tin đăng nhập:');
    console.log('Admin - Email: admin@techstore.com | Password: admin123');
    console.log('User  - Email: user@techstore.com  | Password: user123');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi seed data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
