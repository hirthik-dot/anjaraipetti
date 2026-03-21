import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email?: string;
        phone?: string;
    };
}

// Verify customer auth (JWT cookie or Bearer token)
export const authenticateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = (req as any).cookies?.token || (req as any).headers?.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'AUTH_REQUIRED',
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                userId: string;
                role?: string;
            };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found',
                    code: 'USER_NOT_FOUND',
                });
                return;
            }

            (req as any).user = {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: 'user'
            };
            next();
        } catch {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
                code: 'INVALID_TOKEN',
            });
        }
    } catch (error) {
        next(error);
    }
};

// Verify admin JWT
export const authenticateAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = (req as any).cookies?.adminToken || (req as any).headers?.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
                code: 'ADMIN_AUTH_REQUIRED',
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                adminId: string;
                role: string;
            };

            if (decoded.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required',
                    code: 'ADMIN_ACCESS_REQUIRED',
                });
                return;
            }

            const admin = await prisma.admin.findUnique({
                where: { id: decoded.adminId },
            });

            if (!admin) {
                res.status(401).json({
                    success: false,
                    message: 'Admin not found',
                    code: 'ADMIN_NOT_FOUND',
                });
                return;
            }

            (req as any).admin = {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: 'admin',
            };
            next();
        } catch {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired admin token',
                code: 'INVALID_ADMIN_TOKEN',
            });
        }
    } catch (error) {
        next(error);
    }
};
