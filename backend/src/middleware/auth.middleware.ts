import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2026';

export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
}

// Middleware xác thực JWT
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ error: 'Token không được cung cấp' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

// Middleware kiểm tra quyền Admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Chỉ Admin mới có quyền truy cập' });
    }
    next();
};
