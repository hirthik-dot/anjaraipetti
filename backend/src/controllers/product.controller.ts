import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';

// GET /api/products — all active products with filters
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const { category, search, sort, page = '1', limit = '20' } = req.query;

    const where: any = { isActive: true };

    if (category) {
        where.category = { slug: category as string };
    }

    if (search) {
        where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { nameTa: { contains: search as string } },
        ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.product.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        take: 8,
    });

    res.json({
        success: true,
        data: { products },
    });
});

// GET /api/products/:id
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: { category: true },
    });

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
        });
        return;
    }

    res.json({
        success: true,
        data: { product },
    });
});

// GET /api/products/category/:slug
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
        where: { slug: req.params.slug },
    });

    if (!category) {
        res.status(404).json({
            success: false,
            message: 'Category not found',
            code: 'CATEGORY_NOT_FOUND',
        });
        return;
    }

    const products = await prisma.product.findMany({
        where: { categoryId: category.id, isActive: true },
        include: { category: true },
    });

    res.json({
        success: true,
        data: { category, products },
    });
});
