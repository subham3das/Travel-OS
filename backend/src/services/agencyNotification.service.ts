import mongoose from 'mongoose';
import { AgencyNotificationModel, IAgencyNotification } from '../models/notification.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';

export class AgencyNotificationService {
  /**
   * Get all notifications for an agency with tab counts and filters
   */
  static async getNotifications(
    agencyId: string,
    query: {
      category?: string;
      readStatus?: string;
      search?: string;
      sortBy?: 'newest' | 'oldest';
    } = {}
  ) {
    const aid = new mongoose.Types.ObjectId(agencyId);

    const filter: any = {
      $or: [{ agencyId: aid }, { recipientId: aid, recipientType: 'AGENCY' }],
      isDeleted: false,
    };

    if (query.category && query.category !== 'ALL') {
      filter.category = new RegExp(query.category, 'i');
    }

    if (query.readStatus === 'UNREAD') {
      filter.isUnread = true;
      filter.status = { $ne: 'ARCHIVED' };
    } else if (query.readStatus === 'READ') {
      filter.isUnread = false;
      filter.status = { $ne: 'ARCHIVED' };
    } else {
      filter.status = { $ne: 'ARCHIVED' };
    }

    if (query.search && query.search.trim()) {
      const q = query.search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { relatedEntityId: { $regex: q, $options: 'i' } },
        { relatedEntityName: { $regex: q, $options: 'i' } },
        { triggeredBy: { $regex: q, $options: 'i' } },
      ];
    }

    const sortOrder = query.sortBy === 'oldest' ? 1 : -1;
    const notifications = await AgencyNotificationModel.find(filter)
      .sort({ createdAt: sortOrder })
      .lean();

    // Calculate unread count & category badge tab counts across active notifications
    const allActive = await AgencyNotificationModel.find({
      $or: [{ agencyId: aid }, { recipientId: aid, recipientType: 'AGENCY' }],
      isDeleted: false,
      status: { $ne: 'ARCHIVED' },
    }).lean();

    const unreadCount = allActive.filter((n) => n.isUnread).length;

    const tabCounts: Record<string, number> = {
      All: allActive.length,
      Unread: unreadCount,
      Bookings: allActive.filter((n) => (n.category || '').toLowerCase() === 'bookings' || (n.category || '').toLowerCase() === 'booking').length,
      Payments: allActive.filter((n) => (n.category || '').toLowerCase() === 'payments' || (n.category || '').toLowerCase() === 'payment').length,
      Trips: allActive.filter((n) => (n.category || '').toLowerCase() === 'trips' || (n.category || '').toLowerCase() === 'trip').length,
      Announcements: allActive.filter((n) => (n.category || '').toLowerCase() === 'announcements' || (n.category || '').toLowerCase() === 'announcement').length,
      Admin: allActive.filter((n) => (n.category || '').toLowerCase() === 'admin').length,
      Reviews: allActive.filter((n) => (n.category || '').toLowerCase() === 'reviews' || (n.category || '').toLowerCase() === 'review').length,
      Team: allActive.filter((n) => (n.category || '').toLowerCase() === 'team').length,
    };

    // Format output mapping `_id` to `id`
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

    // Grouping by Date
    const groups: { dateGroup: string; items: typeof mapped }[] = [
      { dateGroup: 'Today', items: [] },
      { dateGroup: 'Yesterday', items: [] },
      { dateGroup: 'This Week', items: [] },
      { dateGroup: 'Earlier', items: [] },
    ];

    mapped.forEach((item) => {
      const g = groups.find((grp) => grp.dateGroup === item.dateGroup);
      if (g) {
        g.items.push(item);
      } else {
        groups.push({ dateGroup: item.dateGroup, items: [item] });
      }
    });

    const groupedNotifications = groups.filter((g) => g.items.length > 0);

    return {
      notifications: mapped,
      groupedNotifications,
      unreadCount,
      tabCounts,
    };
  }

  /**
   * Mark single notification read or unread
   */
  static async markAsRead(agencyId: string, notificationId: string, isUnread = false) {
    if (isUnread) {
      const aid = new mongoose.Types.ObjectId(agencyId);
      const notif = await AgencyNotificationModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(notificationId),
          $or: [{ agencyId: aid }, { recipientId: aid }],
          isDeleted: false,
        },
        {
          $set: {
            isUnread: true,
            status: 'UNREAD',
          },
        },
        { new: true }
      ).lean();

      if (!notif) throw new Error('Notification not found');
      return {
        id: notif._id.toString(),
        isUnread: notif.isUnread,
        status: notif.status,
      };
    }

    const updated = await NotificationDispatcher.markAsRead(notificationId, 'AGENCY', agencyId);
    return {
      id: updated._id.toString(),
      isUnread: updated.isUnread,
      status: updated.status,
    };
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(agencyId: string) {
    return NotificationDispatcher.markAllAsRead('AGENCY', agencyId);
  }

  /**
   * Clear / delete all read notifications
   */
  static async clearAllRead(agencyId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await AgencyNotificationModel.updateMany(
      {
        $or: [{ agencyId: aid }, { recipientId: aid }],
        isDeleted: false,
        isUnread: false,
      },
      { $set: { isDeleted: true } }
    );
    return { success: true, message: 'All read notifications cleared' };
  }

  /**
   * Delete single notification
   */
  static async deleteNotification(agencyId: string, notificationId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const notif = await AgencyNotificationModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        $or: [{ agencyId: aid }, { recipientId: aid }],
        isDeleted: false,
      },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!notif) throw new Error('Notification not found');
    return { success: true, message: 'Notification deleted successfully' };
  }

  /**
   * Archive single notification
   */
  static async archiveNotification(agencyId: string, notificationId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const notif = await AgencyNotificationModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        $or: [{ agencyId: aid }, { recipientId: aid }],
        isDeleted: false,
      },
      { $set: { status: 'ARCHIVED' } },
      { new: true }
    );
    if (!notif) throw new Error('Notification not found');
    return { success: true, message: 'Notification archived successfully' };
  }
}
