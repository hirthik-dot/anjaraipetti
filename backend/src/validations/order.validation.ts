import { z } from 'zod';

const addressSchema = z.object({
    line1: z.string().min(1).max(500),
    line2: z.string().max(500).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
});

export const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
    })).min(1),
    address: addressSchema,
    paymentMode: z.enum(['RAZORPAY', 'COD']),
    notes: z.string().max(500).optional(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
});

export const updateOrderStatusSchema = z.object({
    orderStatus: z.enum(['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
