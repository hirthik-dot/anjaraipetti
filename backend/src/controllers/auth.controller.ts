import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';
import { firebaseAuth } from '../lib/firebase-admin';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';

// POST /api/auth/verify — Firebase token → create/login user
export const verifyFirebaseToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { idToken, name } = req.body;

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
        res.status(400).json({
            success: false,
            message: 'Phone number not found in token',
            code: 'PHONE_NOT_FOUND',
        });
        return;
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
        include: { addresses: true },
    });

    if (!user) {
        // Create new user
        user = await prisma.user.create({
            data: {
                name: name || 'Customer',
                phone: phone_number,
                firebaseUid: uid,
            },
            include: { addresses: true },
        });
    }

    // Create JWT
    const token = jwt.sign(
        { userId: user.id, role: 'customer' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                addresses: user.addresses,
            },
            token,
        },
    });
});

// POST /api/auth/admin/login
export const adminLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

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
    if (req.user) {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { addresses: true },
        });

        res.json({
            success: true,
            data: { user },
        });
        return;
    }

    if (req.admin) {
        res.json({
            success: true,
            data: {
                admin: {
                    id: req.admin.id,
                    name: req.admin.name,
                    email: req.admin.email,
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
