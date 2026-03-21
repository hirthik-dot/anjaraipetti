import { Router } from 'express';
import multer from 'multer';
import {
    getDashboard,
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminOrders,
    getAdminOrder,
    updateOrderStatus,
    getCustomers,
    getAuditLogs,
} from '../controllers/admin.controller';
import { updateSiteSettings, uploadLogo, resetLogo } from '../controllers/siteSettings.controller';
import { getAllSlides, createSlide, updateSlide, deleteSlide, reorderSlides } from '../controllers/carousel.controller';
import { uploadProductVideo, deleteProductVideo } from '../controllers/video.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validations/product.validation';
import { updateOrderStatusSchema } from '../validations/order.validation';

const router = Router();

// Multer for image uploads
const imageUpload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// Multer for video uploads
const videoUpload = multer({
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (_req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only MP4, MOV or WebM videos accepted'));
        }
    },
});

// All admin routes require admin authentication
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.get('/products', getAdminProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// Product Videos
router.post('/products/:id/video', videoUpload.single('video'), uploadProductVideo);
router.delete('/products/:id/video', deleteProductVideo);

// Orders
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrder);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// Customers
router.get('/customers', getCustomers);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Site Settings
router.put('/site-settings', updateSiteSettings);
router.post('/site-settings/logo', imageUpload.single('logo'), uploadLogo);
router.delete('/site-settings/logo', resetLogo);

// Carousel Slides
router.get('/carousel', getAllSlides);
router.post('/carousel', imageUpload.single('image'), createSlide);
router.put('/carousel/reorder', reorderSlides);
router.put('/carousel/:id', imageUpload.single('image'), updateSlide);
router.delete('/carousel/:id', deleteSlide);

export default router;
