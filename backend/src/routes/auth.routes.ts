import { Router } from 'express';
import { verifyFirebaseToken, adminLogin, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { verifyTokenSchema, adminLoginSchema } from '../validations/auth.validation';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/verify', authLimiter, validate(verifyTokenSchema), verifyFirebaseToken);
router.post('/admin/login', authLimiter, validate(adminLoginSchema), adminLogin);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);

export default router;
