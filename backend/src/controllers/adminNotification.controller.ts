import { Request, Response } from 'express';
import { adminNotificationService } from '../services/adminNotification.service.js';

export class AdminNotificationController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminNotificationService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch notification KPIs' });
    }
  }

  async getCampaigns(req: Request, res: Response) {
    try {
      const { search, type, status } = req.query;
      const campaigns = await adminNotificationService.getCampaigns({
        search: search as string,
        type: type as string,
        status: status as string,
      });
      res.status(200).json({ success: true, data: campaigns });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch campaigns' });
    }
  }

  async createCampaign(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const campaign = await adminNotificationService.createCampaign(req.body, admin);
      res.status(201).json({ success: true, data: campaign, message: 'Campaign created successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create campaign' });
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminNotificationService.deleteCampaign(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Campaign deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete campaign' });
    }
  }

  async getHeaderNotifications(req: Request, res: Response) {
    try {
      const notifications = await adminNotificationService.getHeaderNotifications();
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch header notifications' });
    }
  }

  async getFeedNotifications(req: Request, res: Response) {
    try {
      const { category, search, groupId, filterId } = req.query;
      const notifications = await adminNotificationService.getFeedNotifications({
        category: category as string,
        search: search as string,
        groupId: groupId as string,
        filterId: filterId as string,
      });
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch feed notifications' });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await adminNotificationService.getUnreadCount();
      res.status(200).json({ success: true, data: { unreadCount: count } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch unread count' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await adminNotificationService.markAsRead(id);
      res.status(200).json({ success: true, data: result, message: 'Notification marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to mark notification as read' });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const result = await adminNotificationService.markAllAsRead();
      res.status(200).json({ success: true, data: result, message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to mark all as read' });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await adminNotificationService.deleteNotification(id);
      res.status(200).json({ success: true, data: result, message: 'Notification deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete notification' });
    }
  }

  async bulkMarkAsRead(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const result = await adminNotificationService.bulkMarkAsRead(ids || []);
      res.status(200).json({ success: true, data: result, message: 'Bulk read updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed bulk read' });
    }
  }

  async bulkArchive(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const result = await adminNotificationService.bulkArchive(ids || []);
      res.status(200).json({ success: true, data: result, message: 'Bulk archive updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed bulk archive' });
    }
  }

  async bulkDelete(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const result = await adminNotificationService.bulkDelete(ids || []);
      res.status(200).json({ success: true, data: result, message: 'Bulk delete completed' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed bulk delete' });
    }
  }

  async createFeedNotification(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const { title, description, category, priority, targetRoute, relatedEntityType, metadata } = req.body;

      const { NotificationDispatcher } = await import('../services/notificationDispatcher.service.js');

      const notification = await NotificationDispatcher.notifyAdmin({
        title: title || 'New Notification',
        description: description || '',
        category: category || 'System',
        priority: priority || 'MEDIUM',
        targetRoute: targetRoute || '/admin/dashboard',
        relatedEntityType: relatedEntityType || 'SYSTEM',
        triggeredBy: admin?.name || 'Super Admin',
        metadata: metadata ? (typeof metadata === 'string' ? { info: metadata } : metadata) : {},
      });

      const formatted = {
        id: notification._id.toString(),
        category: (notification.category || 'system').toLowerCase(),
        title: notification.title,
        description: notification.description,
        metadata: '',
        time: 'Just now',
        timeGroup: 'Today',
        priority: notification.priority
          ? notification.priority.charAt(0) + notification.priority.slice(1).toLowerCase()
          : 'Medium',
        status: 'Action Required',
        isRead: false,
        isPinned: false,
        targetRoute: notification.targetRoute || '/admin/dashboard',
        actions: [{ label: 'View', actionType: 'view', variant: 'outline' }],
      };

      res.status(201).json({ success: true, data: formatted, message: 'Notification created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create notification' });
    }
  }
}

export const adminNotificationController = new AdminNotificationController();

