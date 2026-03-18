import { z } from 'zod';

export const addressSchema = z.object({
    line1: z.string().min(1, 'Address line 1 is required').max(500),
    line2: z.string().max(500).optional(),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
});

export const checkoutSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: addressSchema,
    paymentMode: z.enum(['RAZORPAY', 'COD']),
    notes: z.string().max(500).optional(),
});

export const phoneSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit mobile number'),
});

export const otpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit OTP'),
});

export const adminLoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const productFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    nameTa: z.string().min(1, 'Tamil name is required').max(200),
    description: z.string().min(1, 'Description is required').max(2000),
    descTa: z.string().min(1, 'Tamil description is required').max(2000),
    price: z.number().positive('Price must be positive'),
    mrp: z.number().positive('MRP must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().min(1, 'Category is required'),
    weight: z.string().min(1, 'Weight is required'),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});
