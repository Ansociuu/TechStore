"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProducts = void 0;
const prisma_1 = require("../lib/prisma");
const getProducts = async (query) => {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where = {};
    if (category && category !== 'all')
        where.category = String(category);
    if (search)
        where.name = { contains: String(search) };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.gte = Number(minPrice);
        if (maxPrice)
            where.price.lte = Number(maxPrice);
    }
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc')
        orderBy = { price: 'asc' };
    if (sort === 'price_desc')
        orderBy = { price: 'desc' };
    if (sort === 'name_asc')
        orderBy = { name: 'asc' };
    const [products, total] = await Promise.all([
        prisma_1.prisma.product.findMany({ where, skip, take, orderBy }),
        prisma_1.prisma.product.count({ where }),
    ]);
    return {
        products,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    return await prisma_1.prisma.product.findUnique({
        where: { id },
        include: {
            reviews: {
                include: {
                    user: { select: { id: true, name: true, avatar: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
};
exports.getProductById = getProductById;
