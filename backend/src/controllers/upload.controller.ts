import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { uploadImage, deleteImage } from '../services/cloudinary.service';

// POST /api/upload/image — Upload to Cloudinary
export const uploadProductImage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: 'No file uploaded',
            code: 'NO_FILE',
        });
        return;
    }

    const result = await uploadImage(req.file.path);

    res.json({
        success: true,
        data: {
            url: result.url,
            publicId: result.publicId,
        },
    });
});

// DELETE /api/upload/image — Delete from Cloudinary
export const deleteProductImage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { publicId } = req.body;

    if (!publicId) {
        res.status(400).json({
            success: false,
            message: 'Public ID is required',
            code: 'PUBLIC_ID_REQUIRED',
        });
        return;
    }

    await deleteImage(publicId);

    res.json({
        success: true,
        message: 'Image deleted successfully',
    });
});
