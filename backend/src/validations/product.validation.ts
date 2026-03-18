import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    nameTa: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
    descTa: z.string().min(1).max(2000),
    price: z.number().positive(),
    mrp: z.number().positive(),
    stock: z.number().int().min(0),
    images: z.array(z.string().url()).min(1),
    categoryId: z.string().min(1),
    isActive: z.boolean().optional().default(true),
    isFeatured: z.boolean().optional().default(false),
    weight: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial();
