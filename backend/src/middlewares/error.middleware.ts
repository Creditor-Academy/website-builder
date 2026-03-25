import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils.js';
import multer from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${req.method}] ${req.path} →`, err.message);

    // Custom Error (in api routes)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Multer Error
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }

    // Unexpected Error
    return res.status(500).json({ error: 'Internal server error' });
}