import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';

// GET /api/categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    res.json({
        success: true,
        data: { categories },
    });
});
