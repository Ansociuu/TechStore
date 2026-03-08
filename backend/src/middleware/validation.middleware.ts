import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validate = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Dữ liệu không hợp lệ',
                    details: error.issues.map(err => ({
                        path: err.path,
                        message: err.message
                    }))
                });
            }
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    };
};
