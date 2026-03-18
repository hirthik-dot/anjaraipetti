import rateLimit from 'express-rate-limit';

// Global rate limiter
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
    },
});

// Auth routes — stricter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
});

// Payment routes
export const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many payment requests, please try again later.',
        code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
    },
});
