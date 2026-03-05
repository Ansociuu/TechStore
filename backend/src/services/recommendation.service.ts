import { prisma } from '../index';

// ========================================
// Collaborative Filtering Recommendation Engine
// ========================================

interface UserItemMatrix {
    [userId: number]: { [productId: number]: number };
}

/**
 * Xây dựng ma trận User × Product từ lịch sử đơn hàng
 * Giá trị = tổng số lượng sản phẩm user đã mua
 */
async function buildUserItemMatrix(): Promise<UserItemMatrix> {
    const orderItems = await prisma.orderItem.findMany({
        include: {
            order: { select: { userId: true, status: true } }
        }
    });

    const matrix: UserItemMatrix = {};
    for (const item of orderItems) {
        // Chỉ tính đơn hàng đã hoàn thành hoặc đang xử lý (không tính cancelled)
        if (item.order.status === 'cancelled') continue;

        const userId = item.order.userId;
        if (!matrix[userId]) matrix[userId] = {};
        matrix[userId][item.productId] = (matrix[userId][item.productId] || 0) + item.quantity;
    }

    return matrix;
}

/**
 * Tính cosine similarity giữa 2 vector
 */
function cosineSimilarity(vecA: { [key: number]: number }, vecB: { [key: number]: number }): number {
    const allKeys = new Set([...Object.keys(vecA).map(Number), ...Object.keys(vecB).map(Number)]);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of allKeys) {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * User-based Collaborative Filtering
 * Tìm K user tương tự → gợi ý sản phẩm mà họ đã mua nhưng user hiện tại chưa mua
 */
export async function getUserBasedRecommendations(userId: number, topK: number = 5): Promise<any[]> {
    const matrix = await buildUserItemMatrix();
    const currentUserVector = matrix[userId];

    // Nếu user chưa mua gì, trả về sản phẩm bán chạy
    if (!currentUserVector || Object.keys(currentUserVector).length === 0) {
        return getPopularProducts(topK);
    }

    // Tính similarity với tất cả user khác
    const similarities: { userId: number; score: number }[] = [];
    for (const otherUserId of Object.keys(matrix).map(Number)) {
        if (otherUserId === userId) continue;
        const score = cosineSimilarity(currentUserVector, matrix[otherUserId]);
        if (score > 0) {
            similarities.push({ userId: otherUserId, score });
        }
    }

    // Sắp xếp theo similarity giảm dần
    similarities.sort((a, b) => b.score - a.score);
    const topUsers = similarities.slice(0, topK);

    // Thu thập sản phẩm từ user tương tự mà user hiện tại chưa mua
    const productScores: { [productId: number]: number } = {};
    const currentProducts = new Set(Object.keys(currentUserVector).map(Number));

    for (const sim of topUsers) {
        const simUserVector = matrix[sim.userId];
        for (const [prodId, qty] of Object.entries(simUserVector)) {
            const pid = Number(prodId);
            if (!currentProducts.has(pid)) {
                productScores[pid] = (productScores[pid] || 0) + sim.score * qty;
            }
        }
    }

    // Sắp xếp sản phẩm theo điểm
    const sortedProducts = Object.entries(productScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topK)
        .map(([id]) => Number(id));

    if (sortedProducts.length === 0) {
        return getPopularProducts(topK);
    }

    // Lấy thông tin chi tiết sản phẩm
    const products = await prisma.product.findMany({
        where: { id: { in: sortedProducts } }
    });

    // Giữ nguyên thứ tự theo score
    return sortedProducts
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
}

/**
 * Item-based Collaborative Filtering
 * Tìm K sản phẩm thường được mua cùng với sản phẩm hiện tại
 */
export async function getItemBasedRecommendations(productId: number, topK: number = 5): Promise<any[]> {
    const matrix = await buildUserItemMatrix();

    // Chuyển vị ma trận: Product × User
    const itemMatrix: Record<number, Record<number, number>> = {};
    for (const [userIdStr, products] of Object.entries(matrix)) {
        const uId = Number(userIdStr);
        for (const [prodIdStr, qty] of Object.entries(products)) {
            const pId = Number(prodIdStr);
            if (!itemMatrix[pId]) itemMatrix[pId] = {};
            itemMatrix[pId][uId] = qty as number;
        }
    }

    const currentItemVector = itemMatrix[productId];
    if (!currentItemVector) {
        return getPopularProducts(topK);
    }

    // Tính similarity với tất cả sản phẩm khác
    const similarities: { productId: number; score: number }[] = [];
    for (const otherProdId of Object.keys(itemMatrix).map(Number)) {
        if (otherProdId === productId) continue;
        const score = cosineSimilarity(currentItemVector, itemMatrix[otherProdId]);
        if (score > 0) {
            similarities.push({ productId: otherProdId, score });
        }
    }

    similarities.sort((a, b) => b.score - a.score);
    const topItems = similarities.slice(0, topK).map(s => s.productId);

    if (topItems.length === 0) {
        return getPopularProducts(topK);
    }

    const products = await prisma.product.findMany({
        where: { id: { in: topItems } }
    });

    return topItems
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
}

/**
 * Hybrid: kết hợp User-based + Item-based CF
 */
export async function getHybridRecommendations(userId: number, topK: number = 8): Promise<any[]> {
    const [userBased, cartItems] = await Promise.all([
        getUserBasedRecommendations(userId, topK),
        prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } }
        })
    ]);

    // Lấy item-based từ sản phẩm trong giỏ hàng
    let itemBased: any[] = [];
    if (cartItems?.items?.length) {
        const itemPromises = cartItems.items.slice(0, 3).map(item =>
            getItemBasedRecommendations(item.productId, 3)
        );
        const results = await Promise.all(itemPromises);
        itemBased = results.flat();
    }

    // Kết hợp và loại bỏ trùng lặp
    const seen = new Set<number>();
    const combined: any[] = [];

    // Xen kẽ user-based và item-based
    const maxLen = Math.max(userBased.length, itemBased.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < userBased.length && !seen.has(userBased[i].id)) {
            seen.add(userBased[i].id);
            combined.push({ ...userBased[i], source: 'user-based' });
        }
        if (i < itemBased.length && !seen.has(itemBased[i].id)) {
            seen.add(itemBased[i].id);
            combined.push({ ...itemBased[i], source: 'item-based' });
        }
    }

    return combined.slice(0, topK);
}

/**
 * Fallback: Sản phẩm phổ biến nhất (cho user mới chưa có lịch sử)
 */
async function getPopularProducts(topK: number = 5): Promise<any[]> {
    // Tính từ OrderItem: sản phẩm được mua nhiều nhất
    const popularItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: topK
    });

    if (popularItems.length === 0) {
        // Nếu chưa có đơn hàng nào, trả về sản phẩm hot/mới
        return prisma.product.findMany({
            where: { OR: [{ isHot: true }, { isNew: true }] },
            take: topK,
            orderBy: { rating: 'desc' }
        });
    }

    const productIds = popularItems.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    return productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
}

/**
 * Lấy context cho AI chat: thông tin sản phẩm, lịch sử mua, gợi ý CF
 */
export async function getAIContext(userId?: number): Promise<string> {
    // 1. Danh sách sản phẩm
    const products = await prisma.product.findMany({
        select: { id: true, name: true, price: true, category: true, rating: true, stock: true, specs: true },
        take: 50,
        orderBy: { rating: 'desc' }
    });

    let context = `\n=== DANH SÁCH SẢN PHẨM TECHSTORE ===\n`;
    for (const p of products) {
        context += `- [ID:${p.id}] ${p.name} | ${p.category} | ${p.price.toLocaleString('vi-VN')}₫ | ⭐${p.rating} | Kho: ${p.stock}`;
        if (p.specs) {
            const specs = p.specs as Record<string, string>;
            const specStr = Object.entries(specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ');
            context += ` | ${specStr}`;
        }
        context += '\n';
    }

    // 2. Nếu có user, thêm lịch sử mua và gợi ý CF
    if (userId) {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: { select: { name: true, category: true } } } } },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        if (orders.length > 0) {
            context += `\n=== LỊCH SỬ MUA HÀNG CỦA KHÁCH ===\n`;
            for (const order of orders) {
                const itemNames = order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
                context += `- Đơn #${order.id} (${order.status}): ${itemNames} — ${order.total.toLocaleString('vi-VN')}₫\n`;
            }
        }

        // Giỏ hàng hiện tại
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: { select: { name: true, category: true, price: true } } } } }
        });

        if (cart?.items?.length) {
            context += `\n=== GIỎ HÀNG HIỆN TẠI ===\n`;
            for (const item of cart.items) {
                context += `- ${item.product.name} (x${item.quantity}) — ${(item.product.price * item.quantity).toLocaleString('vi-VN')}₫\n`;
            }
        }

        // Gợi ý CF
        try {
            const cfRecs = await getUserBasedRecommendations(userId, 5);
            if (cfRecs.length > 0) {
                context += `\n=== GỢI Ý TỪ COLLABORATIVE FILTERING ===\n`;
                for (const rec of cfRecs) {
                    context += `- ${rec.name} | ${rec.category} | ${rec.price.toLocaleString('vi-VN')}₫\n`;
                }
            }
        } catch (e) {
            // Ignore CF errors for context
        }
    }

    return context;
}
