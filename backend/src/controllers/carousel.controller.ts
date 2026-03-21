import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { uploadImage, deleteImage } from '../services/cloudinary.service';

// GET /api/carousel — Public, fetches active carousel slides
export const getActiveSlides = asyncHandler(async (_req: Request, res: Response) => {
    const slides = await prisma.carouselSlide.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
    });

    res.json({
        success: true,
        data: { slides },
    });
});

// GET /api/admin/carousel — Admin, fetches all carousel slides
export const getAllSlides = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const slides = await prisma.carouselSlide.findMany({
        orderBy: { sortOrder: 'asc' },
    });

    res.json({
        success: true,
        data: { slides },
    });
});

// POST /api/admin/carousel — Create new slide
export const createSlide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { headline, subtext, ctaText, ctaLink, isActive } = (req as any).body;

    // Check max slides limit
    const count = await prisma.carouselSlide.count();
    if (count >= 8) {
        res.status(400).json({
            success: false,
            message: 'Maximum 8 slides allowed',
            code: 'MAX_SLIDES_REACHED',
        });
        return;
    }

    if (!(req as any).file) {
        res.status(400).json({
            success: false,
            message: 'Slide image is required',
            code: 'NO_FILE',
        });
        return;
    }

    const result = await uploadImage((req as any).file.path);

    // Get max sort order
    const maxSort = await prisma.carouselSlide.aggregate({
        _max: { sortOrder: true },
    });

    const slide = await prisma.carouselSlide.create({
        data: {
            imageUrl: result.url,
            headline: headline || null,
            subtext: subtext || null,
            ctaText: ctaText || 'Shop Now',
            ctaLink: ctaLink || '/category/masala',
            sortOrder: (maxSort._max.sortOrder || 0) + 1,
            isActive: isActive !== 'false',
        },
    });

    res.status(201).json({
        success: true,
        data: { slide },
    });
});

// PUT /api/admin/carousel/:id — Update slide
export const updateSlide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = (req as any).params;
    const { headline, subtext, ctaText, ctaLink, isActive, sortOrder } = (req as any).body;

    const existing = await prisma.carouselSlide.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({
            success: false,
            message: 'Slide not found',
            code: 'SLIDE_NOT_FOUND',
        });
        return;
    }

    const data: any = {};
    if (headline !== undefined) data.headline = headline;
    if (subtext !== undefined) data.subtext = subtext;
    if (ctaText !== undefined) data.ctaText = ctaText;
    if (ctaLink !== undefined) data.ctaLink = ctaLink;
    if (isActive !== undefined) data.isActive = isActive === true || isActive === 'true';
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    // If new image uploaded
    if ((req as any).file) {
        const result = await uploadImage((req as any).file.path);
        data.imageUrl = result.url;
    }

    const slide = await prisma.carouselSlide.update({
        where: { id },
        data,
    });

    res.json({
        success: true,
        data: { slide },
    });
});

// PUT /api/admin/carousel/reorder — Reorder slides
export const reorderSlides = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { slideIds } = (req as any).body; // Array of slide IDs in new order

    if (!Array.isArray(slideIds)) {
        res.status(400).json({
            success: false,
            message: 'slideIds must be an array',
            code: 'INVALID_DATA',
        });
        return;
    }

    // Update sort orders in a transaction
    await prisma.$transaction(
        slideIds.map((id: string, index: number) =>
            prisma.carouselSlide.update({
                where: { id },
                data: { sortOrder: index },
            })
        )
    );

    const slides = await prisma.carouselSlide.findMany({
        orderBy: { sortOrder: 'asc' },
    });

    res.json({
        success: true,
        data: { slides },
    });
});

// DELETE /api/admin/carousel/:id — Delete slide
export const deleteSlide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = (req as any).params;

    const existing = await prisma.carouselSlide.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({
            success: false,
            message: 'Slide not found',
            code: 'SLIDE_NOT_FOUND',
        });
        return;
    }

    await prisma.carouselSlide.delete({ where: { id } });

    res.json({
        success: true,
        message: 'Slide deleted successfully',
    });
});
