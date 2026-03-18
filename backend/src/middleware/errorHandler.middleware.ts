import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal server error';
    const code = err.code || 'INTERNAL_ERROR';

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            code,
        });
    }

    res.status(statusCode).json({
        success: false,
        message,
        code,
        // Never expose stack traces in production
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// Helper to create operational errors
export const createError = (
    message: string,
    statusCode: number,
    code: string
): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.isOperational = true;
    return error;
};

// Catch unhandled async errors
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
