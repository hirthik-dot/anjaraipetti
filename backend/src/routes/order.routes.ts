import { Router } from 'express';
import { createOrder, getMyOrders, getOrder } from '../controllers/order.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderSchema } from '../validations/order.validation';

const router = Router();

router.post('/', authenticateUser, validate(createOrderSchema), createOrder);
router.get('/my', authenticateUser, getMyOrders);
router.get('/:id', authenticateUser, getOrder);

export default router;
