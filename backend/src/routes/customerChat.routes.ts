import { Router } from 'express';
import { customerChatController } from '../controllers/customerChat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', customerChatController.getConversations);
router.get('/conversations/:id', customerChatController.getConversationById);
router.post('/conversations/:id/messages', customerChatController.sendMessage);
router.post('/messages', customerChatController.sendMessage);

export default router;
