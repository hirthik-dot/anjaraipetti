import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { uploadImage } from '../services/cloudinary.service';

// GET /api/site-settings — Public, fetches site settings
export const getSiteSettings = asyncHandler(async (_req: Request, res: Response) => {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: { id: 1 },
        });
    }

    res.json({
        success: true,
        data: { settings },
    });
});

// PUT /api/admin/site-settings — Admin only, update settings
export const updateSiteSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { tickerMessages, tickerEnabled, tickerSpeed, logoUrl } = (req as any).body;

    const data: any = {};
    if (tickerMessages !== undefined) data.tickerMessages = tickerMessages;
    if (tickerEnabled !== undefined) data.tickerEnabled = tickerEnabled;
    if (tickerSpeed !== undefined) data.tickerSpeed = tickerSpeed;
    if (logoUrl !== undefined) data.logoUrl = logoUrl;

    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
    });

    res.json({
        success: true,
        data: { settings },
    });
});

// POST /api/admin/site-settings/logo — Upload logo image
export const uploadLogo = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!(req as any).file) {
        res.status(400).json({
            success: false,
            message: 'No file uploaded',
            code: 'NO_FILE',
        });
        return;
    }

    const result = await uploadImage((req as any).file.path);

    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, logoUrl: result.url },
        update: { logoUrl: result.url },
    });

    res.json({
        success: true,
        data: {
            logoUrl: result.url,
            settings,
        },
    });
});

// DELETE /api/admin/site-settings/logo — Reset logo to default
export const resetLogo = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, logoUrl: null },
        update: { logoUrl: null },
    });

    res.json({
        success: true,
        data: { settings },
        message: 'Logo reset to default',
    });
});
