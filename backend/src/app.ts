import express from 'express';
import cookieParser from 'cookie-parser';
import { setupSecurity } from './middleware/security.middleware';
import { globalLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

const app = express();

// Initialize Sentry (if DSN provided)
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn') {
    try {
        const Sentry = require('@sentry/node');
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
        });
        app.use(Sentry.Handlers.requestHandler());
    } catch {
        console.warn('Sentry initialization skipped');
    }
}

// Security middleware
setupSecurity(app);

// Raw body for Razorpay webhook (must be before json parser)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, _res, next) => {
    (req as any).rawBody = req.body.toString();
    req.body = JSON.parse(req.body.toString());
    next();
});

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Global rate limiting
app.use(globalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Anjaraipetti API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        code: 'NOT_FOUND',
    });
});

// Initialize Sentry error handler
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn') {
    try {
        const Sentry = require('@sentry/node');
        app.use(Sentry.Handlers.errorHandler());
    } catch { }
}

// Error handler (must be last)
app.use(errorHandler);

export default app;
