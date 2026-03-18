import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { Express } from 'express';

export const setupSecurity = (app: Express): void => {
    // Helmet — security headers
    app.use(helmet());

    // CORS — whitelist frontend domain
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // HPP — HTTP parameter pollution prevention
    app.use(hpp());
};
