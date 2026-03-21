import { Router } from 'express';
import { getSiteSettings } from '../controllers/siteSettings.controller';
import { getActiveSlides } from '../controllers/carousel.controller';

const router = Router();

// Public routes
router.get('/site-settings', getSiteSettings);
router.get('/carousel', getActiveSlides);

export default router;
