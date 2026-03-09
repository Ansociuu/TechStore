/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REVIEWS_PER_PRODUCT = 5;

const COMMENTS = [
    "Sản phẩm rất tốt, giao hàng nhanh chóng!",
    "Chất lượng tuyệt vời, đóng gói cẩn thận.",
    "Dùng rất mượt, đúng như mô tả.",
    "Giá cả hợp lý, đáng đồng tiền bát gạo.",
    "Thiết kế đẹp, cầm chắc tay.",
    "Sẽ tiếp tục ủng hộ shop trong tương lai.",
    "Hàng chính hãng, bảo hành đầy đủ.",
    "Dịch vụ chăm sóc khách hàng tốt.",
    "Mua làm quà tặng rất sang trọng.",
    "Trải nghiệm tuyệt vời, không có gì để chê.",
];

async function main() {
    console.log('🌟 Bắt đầu Seed dữ liệu đánh giá...');

    // 1. Lấy danh sách sản phẩm và người dùng hiện có
    const products = await prisma.product.findMany();
    const users = await prisma.user.findMany({
        where: {
            role: 'user'
        }
    });

    if (products.length === 0 || users.length === 0) {
        console.error('❌ Cần có ít nhất 1 sản phẩm và 1 người dùng để thực hiện seed.');
        return;
    }

    console.log(`📦 Đang tạo đánh giá cho ${products.length} sản phẩm bằng ${users.length} người dùng...`);

    let totalReviewsCreated = 0;

    for (const product of products) {
        // Để cho tự nhiên, mỗi sản phẩm sẽ có từ 3 đến 8 đánh giá
        const count = Math.floor(Math.random() * 6) + 3;

        // Trộn ngẫu nhiên danh sách người dùng để chọn người đánh giá
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        const selectedUsers = shuffledUsers.slice(0, Math.min(count, users.length));

        for (const user of selectedUsers) {
            // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
            const existingReview = await prisma.review.findFirst({
                where: {
                    productId: product.id,
                    userId: user.id
                }
            });

            if (existingReview) continue;

            // Tạo rating ngẫu nhiên từ 4-5 sao (để điểm cao cho đẹp)
            const rating = Math.floor(Math.random() * 2) + 4;
            const comment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];

            await prisma.review.create({
                data: {
                    productId: product.id,
                    userId: user.id,
                    rating,
                    comment,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Ngẫu nhiên trong 30 ngày qua
                }
            });
            totalReviewsCreated++;
        }

        // Cập nhật lại rating của sản phẩm
        const allReviews = await prisma.review.findMany({
            where: { productId: product.id }
        });

        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await prisma.product.update({
            where: { id: product.id },
            data: {
                rating: averageRating,
                reviewCount: allReviews.length
            }
        });
    }

    console.log(`✅ Hoàn tất! Đã tạo thêm ${totalReviewsCreated} đánh giá mới.`);
}

main()
    .catch((e) => {
        console.error('❌ Lỗi:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
