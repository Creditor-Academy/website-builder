import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${req.method}] ${req.path} →`, err.message);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message, message: err.message });
    }

    // Unexpected Error
    return res.status(500).json({ error: 'Internal server error', message: 'Internal server error' });
}