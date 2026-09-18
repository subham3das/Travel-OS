import { Request, Response } from 'express';
import { NotificationDispatcher } from '../services/notificationDispatcher.service.js';

export class UserNotificationController {
  public async getMyNotifications(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const notifications = await NotificationDispatcher.getUserNotifications(userId);
    res.status(200).json({
      success: true,
      data: { notifications },
    });
  }

  public async getUnreadCount(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const count = await NotificationDispatcher.getUserUnreadCount(userId);
    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  }

  public async markAsRead(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const notificationId = String(req.params.id || '');
    await NotificationDispatcher.markAsRead(notificationId, 'USER', userId);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  }

  public async markAllAsRead(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    await NotificationDispatcher.markAllAsRead('USER', userId);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  }
}

export const userNotificationController = new UserNotificationController();
