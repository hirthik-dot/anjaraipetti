import { Router } from 'express';
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
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validations/product.validation';
import { updateOrderStatusSchema } from '../validations/order.validation';

const router = Router();

// All admin routes require admin authentication
router.use(authenticateAdmin);

router.get('/dashboard', getDashboard);
router.get('/products', getAdminProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrder);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/audit-logs', getAuditLogs);

export default router;
