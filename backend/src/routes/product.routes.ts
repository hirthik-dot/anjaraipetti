import { Router } from 'express';
import { getProducts, getFeaturedProducts, getProduct, getProductsByCategory } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/:id', getProduct);

export default router;
