"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
exports.validate = validate;
