import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Input Validation chains
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid registered email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password input is required')
];

router.post('/register', registerValidation, authController.registerUser);
router.post('/login', loginValidation, authController.loginUser);
router.get('/profile', protect, authController.getUserProfile);
router.put('/profile', protect, authController.updateUserProfile);

export default router;