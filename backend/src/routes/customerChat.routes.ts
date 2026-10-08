import { Router } from 'express';
import { customerChatController } from '../controllers/customerChat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', customerChatController.getConversations);
router.get('/conversations/:id', customerChatController.getConversationById);
router.get('/conversations/:id/contact', customerChatController.getAgencyContactByBooking);
router.get('/contact/:id', customerChatController.getAgencyContactByBooking);
router.get('/:bookingId/contact', customerChatController.getAgencyContactByBooking);
router.post('/conversations/:id/messages', customerChatController.sendMessage);
router.post('/messages', customerChatController.sendMessage);
router.post('/init', customerChatController.initConversation);

export default router;
