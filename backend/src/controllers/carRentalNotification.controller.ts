import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AgencyNotificationModel } from '../models/notification.model.js';
import { ResponseUtil } from '../utils/response.util.js';

/**
 * Car Rental Notification Controller
 * All queries are scoped to: { agencyId, businessType: 'car_rental' }
 * Car Rental notification categories:
 *   Bookings | Payments | Fleet | Drivers | Reviews | Admin | Announcements
 */
export class CarRentalNotificationController {
  /**
   * GET /api/agencies/car-rental/notifications
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      const category = req.query.category ? String(req.query.category) : undefined;
      const readStatus = req.query.readStatus ? String(req.query.readStatus) : undefined;
      const search = req.query.search ? String(req.query.search).trim() : undefined;
      const sortBy = req.query.sortBy === 'oldest' ? 'oldest' : 'newest';

      // Base filter — car_rental scope only
      const filter: any = {
        $or: [
          { agencyId: aid, businessType: 'car_rental' },
          { recipientId: aid, recipientType: 'CAR_RENTAL' },
        ],
        isDeleted: false,
      };

      if (category && category !== 'ALL') {
        filter.category = new RegExp(category, 'i');
      }

      if (readStatus === 'UNREAD') {
        filter.isUnread = true;
        filter.status = { $ne: 'ARCHIVED' };
      } else if (readStatus === 'READ') {
        filter.isUnread = false;
        filter.status = { $ne: 'ARCHIVED' };
      } else {
        filter.status = { $ne: 'ARCHIVED' };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { relatedEntityId: { $regex: search, $options: 'i' } },
          { relatedEntityName: { $regex: search, $options: 'i' } },
          { triggeredBy: { $regex: search, $options: 'i' } },
        ];
      }

      const sortOrder = sortBy === 'oldest' ? 1 : -1;
      const notifications = await AgencyNotificationModel.find(filter)
        .sort({ createdAt: sortOrder })
        .lean();

      // Tab counts
      const allActive = await AgencyNotificationModel.find({
        $or: [
          { agencyId: aid, businessType: 'car_rental' },
          { recipientId: aid, recipientType: 'CAR_RENTAL' },
        ],
        isDeleted: false,
        status: { $ne: 'ARCHIVED' },
      }).lean();

      const unreadCount = allActive.filter((n) => n.isUnread).length;

      const tabCounts: Record<string, number> = {
        All: allActive.length,
        Unread: unreadCount,
        Bookings: allActive.filter((n) => /bookings?/i.test(n.category || '')).length,
        Payments: allActive.filter((n) => /payments?/i.test(n.category || '')).length,
        Fleet: allActive.filter((n) => /fleet|vehicle|car/i.test(n.category || '')).length,
        Drivers: allActive.filter((n) => /driver/i.test(n.category || '')).length,
        Reviews: allActive.filter((n) => /reviews?/i.test(n.category || '')).length,
        Admin: allActive.filter((n) => /admin/i.test(n.category || '')).length,
      };

      const mapped = notifications.map((n) => ({
        id: n._id.toString(),
        category: n.category,
        title: n.title,
        description: n.description,
        timestamp: n.timestamp || 'Just now',
        dateGroup: n.dateGroup || 'Today',
        createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
        isUnread: n.isUnread,
        status: n.status,
        relatedEntityType: n.relatedEntityType,
        relatedEntityId: n.relatedEntityId,
        relatedEntityName: n.relatedEntityName,
        triggeredBy: n.triggeredBy,
        ctaText: n.ctaText,
        ctaLink: n.ctaLink || n.targetRoute,
      }));

      const groups: { dateGroup: string; items: typeof mapped }[] = [
        { dateGroup: 'Today', items: [] },
        { dateGroup: 'Yesterday', items: [] },
        { dateGroup: 'This Week', items: [] },
        { dateGroup: 'Earlier', items: [] },
      ];
      mapped.forEach((item) => {
        const g = groups.find((grp) => grp.dateGroup === item.dateGroup);
        if (g) g.items.push(item);
        else groups.push({ dateGroup: item.dateGroup || 'Today', items: [item] });
      });
      const groupedNotifications = groups.filter((g) => g.items.length > 0);

      return ResponseUtil.success(
        res,
        { notifications: mapped, groupedNotifications, unreadCount, tabCounts },
        'Car Rental notifications fetched'
      );
    } catch (error: any) {
      console.error('[CarRentalNotificationController.getNotifications]', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch notifications', 500);
    }
  }

  /**
   * PATCH /api/agencies/car-rental/notifications/:id/read
   */
  static async markAsRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      const id = String(req.params.id);
      const isUnread = req.body?.isUnread === true;

      const notif = await AgencyNotificationModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
          $or: [{ agencyId: aid, businessType: 'car_rental' }, { recipientId: aid, recipientType: 'CAR_RENTAL' }],
          isDeleted: false,
        },
        { $set: { isUnread, status: isUnread ? 'UNREAD' : 'READ', readAt: isUnread ? null : new Date() } },
        { new: true }
      ).lean();

      if (!notif) return ResponseUtil.error(res, 'Notification not found', 404);

      return ResponseUtil.success(res, {
        id: notif._id.toString(),
        isUnread: notif.isUnread,
        status: notif.status,
      }, `Notification marked as ${isUnread ? 'unread' : 'read'}`);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message || 'Failed to update notification', 500);
    }
  }

  /**
   * POST /api/agencies/car-rental/notifications/read-all
   */
  static async markAllAsRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      await AgencyNotificationModel.updateMany(
        {
          $or: [{ agencyId: aid, businessType: 'car_rental' }, { recipientId: aid, recipientType: 'CAR_RENTAL' }],
          isDeleted: false,
          isUnread: true,
        },
        { $set: { isUnread: false, status: 'READ', readAt: new Date() } }
      );

      return ResponseUtil.success(res, { success: true }, 'All Car Rental notifications marked as read');
    } catch (error: any) {
      return ResponseUtil.error(res, error.message || 'Failed to mark all as read', 500);
    }
  }

  /**
   * POST /api/agencies/car-rental/notifications/clear-read
   */
  static async clearAllRead(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      await AgencyNotificationModel.updateMany(
        {
          $or: [{ agencyId: aid, businessType: 'car_rental' }, { recipientId: aid, recipientType: 'CAR_RENTAL' }],
          isDeleted: false,
          isUnread: false,
        },
        { $set: { isDeleted: true } }
      );

      return ResponseUtil.success(res, { success: true }, 'All read Car Rental notifications cleared');
    } catch (error: any) {
      return ResponseUtil.error(res, error.message || 'Failed to clear notifications', 500);
    }
  }

  /**
   * DELETE /api/agencies/car-rental/notifications/:id
   */
  static async deleteNotification(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      const id = String(req.params.id);

      const notif = await AgencyNotificationModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
          $or: [{ agencyId: aid, businessType: 'car_rental' }, { recipientId: aid, recipientType: 'CAR_RENTAL' }],
          isDeleted: false,
        },
        { $set: { isDeleted: true } },
        { new: true }
      );

      if (!notif) return ResponseUtil.error(res, 'Notification not found', 404);
      return ResponseUtil.success(res, { success: true }, 'Notification deleted');
    } catch (error: any) {
      return ResponseUtil.error(res, error.message || 'Failed to delete notification', 500);
    }
  }

  /**
   * PATCH /api/agencies/car-rental/notifications/:id/archive
   */
  static async archiveNotification(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id;
      if (!agencyId) return ResponseUtil.error(res, 'Authentication required', 401);

      const aid = new mongoose.Types.ObjectId(agencyId.toString());
      const id = String(req.params.id);

      const notif = await AgencyNotificationModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
          $or: [{ agencyId: aid, businessType: 'car_rental' }, { recipientId: aid, recipientType: 'CAR_RENTAL' }],
          isDeleted: false,
        },
        { $set: { status: 'ARCHIVED' } },
        { new: true }
      );

      if (!notif) return ResponseUtil.error(res, 'Notification not found', 404);
      return ResponseUtil.success(res, { success: true }, 'Notification archived');
    } catch (error: any) {
      return ResponseUtil.error(res, error.message || 'Failed to archive notification', 500);
    }
  }
}
