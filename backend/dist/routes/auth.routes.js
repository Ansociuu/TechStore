"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../services/emailService");
const validation_middleware_1 = require("../middleware/validation.middleware");
const schemas_1 = require("../middleware/schemas");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// Register
router.post('/register', (0, validation_middleware_1.validate)(schemas_1.registerSchema), async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await index_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    }
    catch (error) {
        res.status(400).json({ error: 'Email already exists' });
    }
});
// Login
router.post('/login', (0, validation_middleware_1.validate)(schemas_1.loginSchema), async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await index_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        const { password: _, resetToken, resetTokenExpiry, ...userData } = user;
        res.json({ token, user: userData });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await index_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: 'Không tìm thấy người dùng với email này' });
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 giờ
        await index_1.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });
        await (0, emailService_1.sendResetPasswordEmail)(email, resetToken);
        res.json({ message: 'Email khôi phục mật khẩu đã được gửi' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Lỗi server khi gửi mail khôi phục' });
    }
});
// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await index_1.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
        if (!user)
            return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await index_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi server khi đặt lại mật khẩu' });
    }
});
exports.default = router;
