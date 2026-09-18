import { Router } from 'express';
import { userNotificationController } from '../controllers/userNotification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/my', userNotificationController.getMyNotifications);
router.get('/unread-count', userNotificationController.getUnreadCount);
router.patch('/read-all', userNotificationController.markAllAsRead);
router.patch('/:id/read', userNotificationController.markAsRead);

export default router;
