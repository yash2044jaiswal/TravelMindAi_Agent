import express from 'express';
import chatController from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, chatController.handleChatMessage);
router.get('/history', protect, chatController.getChatHistory);

export default router;