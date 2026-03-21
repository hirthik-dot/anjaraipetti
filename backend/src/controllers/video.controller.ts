import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';

// POST /api/admin/products/:id/video — Upload product making video
// Uses Cloudinary for video upload (same as images but with video resource_type)
export const uploadProductVideo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = (req as any).params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
        });
        return;
    }

    if (!(req as any).file) {
        res.status(400).json({
            success: false,
            message: 'No video file uploaded',
            code: 'NO_FILE',
        });
        return;
    }

    // Upload video to Cloudinary
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.upload((req as any).file.path, {
        resource_type: 'video',
        folder: 'anjaraipetti/product-videos',
        public_id: `making-video-${id}`,
        overwrite: true,
    });

    const updatedProduct = await prisma.product.update({
        where: { id },
        data: { makingVideoUrl: result.secure_url },
        include: { category: true },
    });

    res.json({
        success: true,
        data: {
            product: updatedProduct,
            videoUrl: result.secure_url,
        },
        message: 'Video uploaded successfully',
    });
});

// DELETE /api/admin/products/:id/video — Delete product making video
export const deleteProductVideo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = (req as any).params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
        });
        return;
    }

    if (!product.makingVideoUrl) {
        res.status(400).json({
            success: false,
            message: 'No video to delete',
            code: 'NO_VIDEO',
        });
        return;
    }

    // Try to delete from Cloudinary
    try {
        const cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.destroy(`anjaraipetti/product-videos/making-video-${id}`, {
            resource_type: 'video',
        });
    } catch {
        // Continue even if Cloudinary deletion fails
    }

    const updatedProduct = await prisma.product.update({
        where: { id },
        data: { makingVideoUrl: null },
        include: { category: true },
    });

    res.json({
        success: true,
        data: { product: updatedProduct },
        message: 'Video deleted successfully',
    });
});
