import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard analytical lookup
router.get('/dashboard', protect, userController.getDashboardStats);

export default router;