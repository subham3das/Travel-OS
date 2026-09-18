import { Request, Response } from 'express';
import { AgencyNotificationService } from '../services/agencyNotification.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyNotificationController {
  static async getNotifications(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const category = req.query.category ? String(req.query.category) : undefined;
      const readStatus = req.query.readStatus ? String(req.query.readStatus) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;
      const sortBy = req.query.sortBy === 'oldest' ? 'oldest' : 'newest';

      const data = await AgencyNotificationService.getNotifications(agencyId.toString(), {
        category,
        readStatus,
        search,
        sortBy,
      });

      return ResponseUtil.success(res, data, 'Notifications fetched successfully');
    } catch (error: any) {
      console.error('[AgencyNotificationController.getNotifications] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch notifications', 500);
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const id = String(req.params.id);
      const isUnread = req.body?.isUnread === true;

      const data = await AgencyNotificationService.markAsRead(agencyId.toString(), id, isUnread);
      return ResponseUtil.success(res, data, `Notification marked as ${isUnread ? 'unread' : 'read'}`);
    } catch (error: any) {
      console.error('[AgencyNotificationController.markAsRead] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update notification status', 500);
    }
  }

  static async markAllAsRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const data = await AgencyNotificationService.markAllAsRead(agencyId.toString());
      return ResponseUtil.success(res, data, 'All notifications marked as read');
    } catch (error: any) {
      console.error('[AgencyNotificationController.markAllAsRead] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to mark all as read', 500);
    }
  }

  static async clearAllRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const data = await AgencyNotificationService.clearAllRead(agencyId.toString());
      return ResponseUtil.success(res, data, 'All read notifications cleared');
    } catch (error: any) {
      console.error('[AgencyNotificationController.clearAllRead] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to clear read notifications', 500);
    }
  }

  static async deleteNotification(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const id = String(req.params.id);
      const data = await AgencyNotificationService.deleteNotification(agencyId.toString(), id);
      return ResponseUtil.success(res, data, 'Notification deleted successfully');
    } catch (error: any) {
      console.error('[AgencyNotificationController.deleteNotification] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to delete notification', 500);
    }
  }

  static async archiveNotification(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const id = String(req.params.id);
      const data = await AgencyNotificationService.archiveNotification(agencyId.toString(), id);
      return ResponseUtil.success(res, data, 'Notification archived successfully');
    } catch (error: any) {
      console.error('[AgencyNotificationController.archiveNotification] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to archive notification', 500);
    }
  }
}
