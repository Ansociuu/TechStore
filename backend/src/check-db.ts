import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Checking database connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connected to database successfully!');

        const count = await prisma.product.count();
        console.log(`✅ Database query successful. Found ${count} products.`);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
