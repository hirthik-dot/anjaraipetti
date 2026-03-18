import { Router } from 'express';
import multer from 'multer';
import { uploadProductImage, deleteProductImage } from '../controllers/upload.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

const router = Router();

router.post('/image', authenticateAdmin, upload.single('image'), uploadProductImage);
router.delete('/image', authenticateAdmin, deleteProductImage);

export default router;
