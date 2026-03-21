import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';

// POST /api/auth/admin/login
export const adminLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = (req as any).body;

    const admin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!admin) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
        });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
        });
        return;
    }

    const token = jwt.sign(
        { adminId: admin.id, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
    );

    res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    res.json({
        success: true,
        data: {
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
            token,
        },
    });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    res.clearCookie('adminToken');
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    if ((req as any).user) {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).user.id },
            include: { addresses: true },
        });

        res.json({
            success: true,
            data: { user },
        });
        return;
    }

    if ((req as any).admin) {
        res.json({
            success: true,
            data: {
                admin: {
                    id: (req as any).admin.id,
                    name: (req as any).admin.name,
                    email: (req as any).admin.email,
                    role: 'admin',
                },
            },
        });
        return;
    }

    res.status(401).json({
        success: false,
        message: 'Not authenticated',
        code: 'NOT_AUTHENTICATED',
    });
});
