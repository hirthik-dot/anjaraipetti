import { Router } from 'express';
import { createPaymentOrder, verifyPayment, handleWebhook } from '../controllers/payment.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { paymentLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/create-order', authenticateUser, paymentLimiter, createPaymentOrder);
router.post('/verify', authenticateUser, paymentLimiter, verifyPayment);
router.post('/webhook', handleWebhook); // No auth — raw body, signature verified

export default router;
