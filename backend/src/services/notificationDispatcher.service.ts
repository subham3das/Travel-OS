import mongoose from 'mongoose';
import {
  NotificationModel,
  INotification,
  NotificationCategory,
  NotificationPriority,
  INotificationAction,
} from '../models/notification.model.js';
import { socketService } from './socket.service.js';
import { logger } from '../config/logger.config.js';

export interface CreateNotificationOptions {
  title: string;
  description: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  targetRoute?: string;
  ctaText?: string;
  ctaLink?: string;
  actionUrl?: string;
  actions?: INotificationAction[];
  relatedEntityType?: string;
  relatedEntityId?: string;
  relatedEntityName?: string;
  triggeredBy?: string;
  metadata?: Record<string, any>;
  isPinned?: boolean;
}

export class NotificationDispatcher {
  /**
   * Helper to format relative and grouping timestamps
   */
  private static formatTimeMeta() {
    return {
      timestamp: 'Just now',
      dateGroup: 'Today' as const,
      timeGroup: 'Today',
    };
  }

  /**
   * Format notification payload for socket emission and frontend consumption
   */
  private static formatPayload(doc: INotification | any) {
    const rawId = doc._id ? doc._id.toString() : doc.id;
    return {
      id: rawId,
      _id: rawId,
      recipientType: doc.recipientType,
      recipientId: doc.recipientId ? doc.recipientId.toString() : null,
      agencyId: doc.agencyId ? doc.agencyId.toString() : null,
      category: doc.category,
      title: doc.title,
      description: doc.description,
      priority: doc.priority || 'MEDIUM',
      status: doc.status || 'UNREAD',
      isUnread: doc.isUnread !== false,
      readAt: doc.readAt,
      timestamp: doc.timestamp || 'Just now',
      dateGroup: doc.dateGroup || 'Today',
      timeGroup: doc.timeGroup || 'Today',
      time: doc.createdAt ? new Date(doc.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      targetRoute: doc.targetRoute || doc.ctaLink || doc.actionUrl || '',
      ctaText: doc.ctaText || '',
      ctaLink: doc.ctaLink || doc.targetRoute || '',
      actions: doc.actions || [],
      relatedEntityType: doc.relatedEntityType || 'SYSTEM',
      relatedEntityId: doc.relatedEntityId || '',
      relatedEntityName: doc.relatedEntityName || '',
      triggeredBy: doc.triggeredBy || '',
      metadata: doc.metadata || {},
      isPinned: !!doc.isPinned,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  /**
   * 1. Dispatch Notification to Admin Panel
   */
  static async notifyAdmin(options: CreateNotificationOptions): Promise<INotification> {
    try {
      const timeMeta = this.formatTimeMeta();

      const notification = await NotificationModel.create({
        recipientType: 'ADMIN',
        recipientId: null, // Broadcast to all admins
        category: options.category || 'System',
        title: options.title,
        description: options.description,
        priority: options.priority || 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        timestamp: timeMeta.timestamp,
        dateGroup: timeMeta.dateGroup,
        timeGroup: timeMeta.timeGroup,
        targetRoute: options.targetRoute || options.ctaLink || '',
        ctaText: options.ctaText || '',
        ctaLink: options.ctaLink || options.targetRoute || '',
        actionUrl: options.actionUrl || options.targetRoute || '',
        actions: options.actions || [],
        relatedEntityType: options.relatedEntityType || 'SYSTEM',
        relatedEntityId: options.relatedEntityId || '',
        relatedEntityName: options.relatedEntityName || '',
        triggeredBy: options.triggeredBy || 'System',
        metadata: options.metadata || {},
        isPinned: !!options.isPinned,
        isDeleted: false,
      });

      const payload = this.formatPayload(notification);

      // Emit real-time Socket.IO event to admin room
      socketService.emitToAdmin('notification:new', payload);
      logger.info('🔔 Real-time notification dispatched to Admin: "%s"', options.title);

      return notification;
    } catch (error: any) {
      logger.error('Failed to notify Admin: %s', error.message);
      throw error;
    }
  }

  /**
   * 2. Dispatch Notification to a specific Agency
   */
  static async notifyAgency(
    agencyId: string | mongoose.Types.ObjectId,
    options: CreateNotificationOptions
  ): Promise<INotification> {
    try {
      const aid = typeof agencyId === 'string' ? new mongoose.Types.ObjectId(agencyId) : agencyId;
      const timeMeta = this.formatTimeMeta();

      const notification = await NotificationModel.create({
        recipientType: 'AGENCY',
        recipientId: aid,
        agencyId: aid,
        category: options.category || 'System',
        title: options.title,
        description: options.description,
        priority: options.priority || 'MEDIUM',
        status: 'UNREAD',
        isUnread: true,
        timestamp: timeMeta.timestamp,
        dateGroup: timeMeta.dateGroup,
        timeGroup: timeMeta.timeGroup,
        targetRoute: options.targetRoute || options.ctaLink || '',
        ctaText: options.ctaText || 'View Details',
        ctaLink: options.ctaLink || options.targetRoute || '',
        actionUrl: options.actionUrl || options.targetRoute || '',
        actions: options.actions || [],
        relatedEntityType: options.relatedEntityType || 'SYSTEM',
        relatedEntityId: options.relatedEntityId || '',
        relatedEntityName: options.relatedEntityName || '',
        triggeredBy: options.triggeredBy || 'ApnaTrip Platform',
        metadata: options.metadata || {},
        isPinned: !!options.isPinned,
        isDeleted: false,
      });

      const payload = this.formatPayload(notification);

      // Emit real-time Socket.IO event to agency room
      socketService.emitToAgency(aid.toString(), 'notification:new', payload);
      logger.info('🏢 Real-time notification dispatched to Agency %s: "%s"', aid.toString(), options.title);

      return notification;
    } catch (error: any) {
      logger.error('Failed to notify Agency %s: %s', agencyId, error.message);
      throw error;
    }
  }

  /**
   * 3. Dispatch Notification to a specific Traveler / User
   */
  static async notifyUser(
    userId: string | mongoose.Types.ObjectId,
    options: CreateNotificationOptions
  ): Promise<INotification> {
    try {
      const uid = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
      const timeMeta = this.formatTimeMeta();

      const notification = await NotificationModel.create({
        recipientType: 'USER',
        recipientId: uid,
        category: options.category || 'System',
        title: options.title,
        description: options.description,
        priority: options.priority || 'MEDIUM',
        status: 'UNREAD',
        isUnread: true,
        timestamp: timeMeta.timestamp,
        dateGroup: timeMeta.dateGroup,
        timeGroup: timeMeta.timeGroup,
        targetRoute: options.targetRoute || options.ctaLink || '',
        ctaText: options.ctaText || 'View',
        ctaLink: options.ctaLink || options.targetRoute || '',
        actionUrl: options.actionUrl || options.targetRoute || '',
        actions: options.actions || [],
        relatedEntityType: options.relatedEntityType || 'SYSTEM',
        relatedEntityId: options.relatedEntityId || '',
        relatedEntityName: options.relatedEntityName || '',
        triggeredBy: options.triggeredBy || 'ApnaTrip',
        metadata: options.metadata || {},
        isPinned: !!options.isPinned,
        isDeleted: false,
      });

      const payload = this.formatPayload(notification);

      // Emit real-time Socket.IO event to user room
      socketService.emitToUser(uid.toString(), 'notification:new', payload);
      logger.info('👤 Real-time notification dispatched to User %s: "%s"', uid.toString(), options.title);

      return notification;
    } catch (error: any) {
      logger.error('Failed to notify User %s: %s', userId, error.message);
      throw error;
    }
  }

  /**
   * 4. Mark Single Notification as Read
   */
  static async markAsRead(
    notificationId: string,
    recipientType: 'ADMIN' | 'AGENCY' | 'USER',
    recipientId?: string
  ) {
    const filter: any = {
      _id: new mongoose.Types.ObjectId(notificationId),
      recipientType,
      isDeleted: false,
    };

    if (recipientId && recipientType !== 'ADMIN') {
      filter.$or = [
        { recipientId: new mongoose.Types.ObjectId(recipientId) },
        { agencyId: new mongoose.Types.ObjectId(recipientId) },
      ];
    }

    const updated = await NotificationModel.findOneAndUpdate(
      filter,
      {
        $set: {
          isUnread: false,
          status: 'READ',
          readAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      throw new Error('Notification not found or access denied');
    }

    const payload = { id: notificationId, isUnread: false, status: 'READ' };

    if (recipientType === 'ADMIN') {
      socketService.emitToAdmin('notification:read', payload);
    } else if (recipientType === 'AGENCY' && recipientId) {
      socketService.emitToAgency(recipientId, 'notification:read', payload);
    } else if (recipientType === 'USER' && recipientId) {
      socketService.emitToUser(recipientId, 'notification:read', payload);
    }

    return updated;
  }

  /**
   * 5. Mark All Notifications as Read
   */
  static async markAllAsRead(
    recipientType: 'ADMIN' | 'AGENCY' | 'USER',
    recipientId?: string
  ) {
    const filter: any = {
      recipientType,
      isDeleted: false,
      isUnread: true,
    };

    if (recipientId && recipientType !== 'ADMIN') {
      filter.$or = [
        { recipientId: new mongoose.Types.ObjectId(recipientId) },
        { agencyId: new mongoose.Types.ObjectId(recipientId) },
      ];
    }

    await NotificationModel.updateMany(filter, {
      $set: {
        isUnread: false,
        status: 'READ',
        readAt: new Date(),
      },
    });

    const payload = { recipientType, readAll: true };

    if (recipientType === 'ADMIN') {
      socketService.emitToAdmin('notification:read_all', payload);
    } else if (recipientType === 'AGENCY' && recipientId) {
      socketService.emitToAgency(recipientId, 'notification:read_all', payload);
    } else if (recipientType === 'USER' && recipientId) {
      socketService.emitToUser(recipientId, 'notification:read_all', payload);
    }

    return { success: true, message: 'All notifications marked as read' };
  }

  /**
   * 6. Fetch all Notifications for a User
   */
  static async getUserNotifications(userId: string) {
    const uid = new mongoose.Types.ObjectId(userId);
    const notifications = await NotificationModel.find({
      recipientType: 'USER',
      recipientId: uid,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return notifications.map((n: any) => {
      let cat: 'bookings' | 'community' | 'agency' | 'offers' = 'bookings';
      const c = (n.category || '').toLowerCase();
      if (c.includes('community') || c.includes('post') || c.includes('comment')) cat = 'community';
      else if (c.includes('agency') || c.includes('host') || c.includes('guide')) cat = 'agency';
      else if (c.includes('offer') || c.includes('promo') || c.includes('discount')) cat = 'offers';
      else cat = 'bookings';

      let iconType: any = 'check';
      let iconBgColor = 'bg-emerald-500 text-white';
      if (cat === 'community') {
        iconType = 'message';
        iconBgColor = 'bg-purple-500 text-white';
      } else if (cat === 'agency') {
        iconType = 'building';
        iconBgColor = 'bg-blue-500 text-white';
      } else if (cat === 'offers') {
        iconType = 'star';
        iconBgColor = 'bg-orange-500 text-white';
      }

      return {
        id: n._id.toString(),
        type: n.category || 'booking_confirmed',
        category: cat,
        title: n.title,
        description: n.description,
        highlightText: n.relatedEntityName || '',
        timestamp: n.timestamp || 'Just now',
        section: n.dateGroup || 'Today',
        isRead: !n.isUnread,
        iconType,
        iconBgColor,
        actionRoute: n.targetRoute || '/my-trips',
        tripId: n.relatedEntityId || '',
      };
    });
  }

  /**
   * 7. Get Unread Count for a User
   */
  static async getUserUnreadCount(userId: string) {
    const uid = new mongoose.Types.ObjectId(userId);
    const count = await NotificationModel.countDocuments({
      recipientType: 'USER',
      recipientId: uid,
      isDeleted: false,
      isUnread: true,
    });
    return count;
  }
}

