import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { sendOTP } from '../lib/fast2sms';
import { getOTP, deleteOTP, hasOTP } from '../lib/otpCache';
import { prisma } from '../lib/prisma';
import { adminLogin, logout, getMe } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { adminLoginSchema } from '../validations/auth.validation';

const router = express.Router();

const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

const verifySchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// POST /api/auth/send-otp
router.post('/send-otp', authLimiter, async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone } = phoneSchema.parse(req.body);

    const result = await sendOTP(phone);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send OTP. Try again.' });
    }

    return res.status(200).json({ message: 'OTP sent successfully', phone });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('send-otp error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone, otp } = verifySchema.parse(req.body);

    const cachedOTP = getOTP(phone);

    if (!cachedOTP) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (cachedOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP is valid — delete it so it can't be reused
    deleteOTP(phone);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { phone },
      update: { lastLoginAt: new Date() },
      create: { phone, name: 'Customer', firebaseUid: phone },
    });

    // Issue JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );
    
    // Set httpOnly cookie for internal compatibility
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('verify-otp error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', authLimiter, async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone } = phoneSchema.parse(req.body);

    const result = await sendOTP(phone);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to resend OTP.' });
    }

    return res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin and GetMe Routes (preserves non-Firebase existing behavior)
router.post('/admin/login', authLimiter, validate(adminLoginSchema), adminLogin);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);

export default router;
