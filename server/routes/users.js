import express from 'express';
import * as userCtrl from '../controllers/userController';
import auth from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later'
});

// Routes
router.post('/register', authLimiter, userCtrl.register);
router.post('/login', authLimiter, userCtrl.login);
router.get('/me', auth, userCtrl.getMe);
router.put('/quick-access', auth, userCtrl.updateQuickAccessConfigurations);

export default router;