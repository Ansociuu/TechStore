import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL!);
        console.log('Successfully connected to Aiven MySQL!');
        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
