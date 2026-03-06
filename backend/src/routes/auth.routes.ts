import { Router } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../services/emailService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        const { password: _, resetToken, resetTokenExpiry, ...userData } = user;
        res.json({ token, user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng với email này' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 giờ

        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });

        await sendResetPasswordEmail(email, resetToken);
        res.json({ message: 'Email khôi phục mật khẩu đã được gửi' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Lỗi server khi gửi mail khôi phục' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user) return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server khi đặt lại mật khẩu' });
    }
});

export default router;
