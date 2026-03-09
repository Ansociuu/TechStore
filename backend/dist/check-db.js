"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔄 Checking database connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connected to database successfully!');
        const count = await prisma.product.count();
        console.log(`✅ Database query successful. Found ${count} products.`);
    }
    catch (error) {
        console.error('❌ Connection failed:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
