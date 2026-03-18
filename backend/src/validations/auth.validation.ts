import { z } from 'zod';

export const verifyTokenSchema = z.object({
    idToken: z.string().min(1, 'Firebase ID token is required'),
    name: z.string().min(1).max(100).optional(),
});

export const adminLoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
