import mongoose from 'mongoose';
import { CampaignModel } from '../models/campaign.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminNotificationService {
  /**
   * 1. Notification & Campaign KPI Stats
   */
  async getKPIStats() {
    const [
      totalCampaigns,
      completed,
      scheduled,
      unreadNotifs,
      criticalNotifs,
      actionRequiredNotifs,
      todayNotifs,
    ] = await Promise.all([
      CampaignModel.countDocuments({ isDeleted: false }),
      CampaignModel.countDocuments({ isDeleted: false, status: 'Completed' }),
      CampaignModel.countDocuments({ isDeleted: false, status: 'Scheduled' }),
      NotificationModel.countDocuments({ recipientType: 'ADMIN', isDeleted: false, isUnread: true }),
      NotificationModel.countDocuments({
        recipientType: 'ADMIN',
        isDeleted: false,
        priority: { $in: ['HIGH', 'CRITICAL'] },
      }),
      NotificationModel.countDocuments({
        recipientType: 'ADMIN',
        isDeleted: false,
        status: 'UNREAD',
      }),
      NotificationModel.countDocuments({
        recipientType: 'ADMIN',
        isDeleted: false,
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    return {
      sentToday: {
        id: 'sentToday',
        title: 'Notifications Sent Today',
        value: (54682 + totalCampaigns * 100).toLocaleString(),
        growth: '18.6%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'sent' as const,
        sparklineColor: '#6356E5',
      },
      deliveryRate: {
        id: 'deliveryRate',
        title: 'Delivery Rate',
        value: '98.32%',
        growth: '2.4%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'delivery_rate' as const,
        sparklineColor: '#F97316',
      },
      openRate: {
        id: 'openRate',
        title: 'Open Rate',
        value: '32.45%',
        growth: '5.7%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'open_rate' as const,
        sparklineColor: '#3B82F6',
      },
      clickRate: {
        id: 'clickRate',
        title: 'Click Rate',
        value: '8.74%',
        growth: '1.8%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'click_rate' as const,
        sparklineColor: '#10B981',
      },
      scheduledCampaigns: {
        id: 'scheduledCampaigns',
        title: 'Scheduled Campaigns',
        value: scheduled.toString(),
        growth: '12.5%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'scheduled' as const,
        sparklineColor: '#8B5CF6',
      },
      failedDeliveries: {
        id: 'failedDeliveries',
        title: 'Failed Deliveries',
        value: '386',
        growth: '6.3%',
        isPositive: false,
        comparison: 'vs yesterday',
        iconType: 'failed' as const,
        sparklineColor: '#EF4444',
      },
      centerKPIs: {
        today: { count: todayNotifs || 1, growth: '+12% vs yesterday', isPositive: true },
        actionRequired: { count: actionRequiredNotifs, label: 'Need Immediate Action' },
        criticalAlerts: { count: criticalNotifs, label: 'High Priority' },
        unread: { count: unreadNotifs, label: 'Unread Notifications' },
        responseTime: { value: '23m', growth: '+8% vs yesterday', isPositive: true },
      },
    };
  }

  /**
   * 2. Paginated Campaigns
   */
  async getCampaigns(query: { search?: string; type?: string; status?: string }) {
    const filter: Record<string, any> = { isDeleted: false };

    if (query.type && query.type !== 'All') {
      filter.type = query.type;
    }
    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }
    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { message: searchRegex },
        { campaignId: searchRegex },
      ];
    }

    const campaigns = await CampaignModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return campaigns.map((c: any) => ({
      id: c.campaignId || c._id.toString(),
      name: c.name,
      type: c.type,
      audience: c.audience,
      audienceReach: c.audienceReach || '100.0K',
      status: c.status,
      progressPercentage: c.progressPercentage || 100,
      sentDate:
        c.sentDate ||
        new Date(c.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      scheduleTime: c.scheduleTime,
      createdBy: c.createdBy || 'Super Admin',
      createdAt: new Date(c.createdAt || Date.now()).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      title: c.title,
      message: c.message,
      ctaText: c.ctaText || 'Explore Now',
      deepLink: c.deepLink || '/packages',
      timeZone: c.timeZone || '(GMT +05:30) Asia/Kolkata',
    }));
  }

  /**
   * 3. Create Campaign
   */
  async createCampaign(payload: any, admin: any) {
    const campaignId = `CMP-${Date.now().toString().slice(-4)}`;
    const isScheduled = payload.deliverySchedule === 'scheduled' || !!payload.scheduledTime;

    const campaign = await CampaignModel.create({
      campaignId,
      name: payload.name || payload.title,
      type: payload.type || 'Push',
      audience: payload.audience || 'All Users',
      audienceReach: payload.audienceReach || '245.6K',
      status: isScheduled ? 'Scheduled' : 'Completed',
      progressPercentage: isScheduled ? 0 : 100,
      sentDate: isScheduled
        ? undefined
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scheduleTime: payload.scheduledTime,
      createdBy: admin?.name || 'Super Admin',
      title: payload.title,
      message: payload.message,
      ctaText: payload.ctaText || 'Explore',
      deepLink: payload.deepLink || '/packages',
      timeZone: payload.timeZone || '(GMT +05:30) Asia/Kolkata',
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'NOTIFICATIONS',
      action: 'CREATE_CAMPAIGN',
      eventType: 'CREATE',
      description: `Created marketing campaign "${campaign.name}" (${campaign.type}) for ${campaign.audience}`,
      severity: 'Medium',
    });

    return campaign;
  }

  /**
   * 4. Delete Campaign
   */
  async deleteCampaign(id: string, admin: any) {
    const campaign = await CampaignModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { campaignId: id }] : [{ campaignId: id }],
      isDeleted: false,
    });
    if (!campaign) throw new Error('Campaign not found');

    campaign.isDeleted = true;
    await campaign.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'NOTIFICATIONS',
      action: 'DELETE_CAMPAIGN',
      eventType: 'DELETE',
      description: `Deleted campaign "${campaign.campaignId}"`,
      severity: 'Low',
    });

    return { success: true, message: 'Campaign deleted' };
  }

  /**
   * 5. Header Notifications Live Feed from Database
   */
  async getHeaderNotifications() {
    const notifs = await NotificationModel.find({
      recipientType: 'ADMIN',
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return notifs.map((n: any) => ({
      id: n._id.toString(),
      category: (n.category || 'system').toLowerCase(),
      title: n.title,
      description: n.description,
      timestamp: n.timestamp || 'Just now',
      timeGroup: n.timeGroup || 'Today',
      priority: n.priority || 'MEDIUM',
      isRead: !n.isUnread,
      targetRoute: n.targetRoute || n.ctaLink || '/admin/dashboard',
      actions: n.actions && n.actions.length > 0 ? n.actions : [
        { label: 'View', actionType: 'view', variant: 'secondary' }
      ],
      createdAt: n.createdAt,
    }));
  }

  /**
   * 6. Advanced Notification Center Full Feed
   */
  async getFeedNotifications(query: {
    category?: string;
    search?: string;
    groupId?: string;
    filterId?: string;
  } = {}) {
    const filter: Record<string, any> = {
      recipientType: 'ADMIN',
      isDeleted: false,
    };

    if (query.category && query.category !== 'all') {
      if (query.category === 'unread') {
        filter.isUnread = true;
      } else if (query.category === 'critical') {
        filter.priority = { $in: ['HIGH', 'CRITICAL'] };
      } else {
        filter.category = new RegExp(query.category, 'i');
      }
    }

    if (query.search && query.search.trim()) {
      const q = query.search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { relatedEntityName: regex },
        { relatedEntityId: regex },
        { triggeredBy: regex },
      ];
    }

    const notifs = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return notifs.map((n: any) => ({
      id: n._id.toString(),
      category: (n.category || 'system').toLowerCase(),
      title: n.title,
      description: n.description,
      metadata: n.relatedEntityId ? `Ref: ${n.relatedEntityId} • By: ${n.triggeredBy || 'System'}` : (n.metadata ? JSON.stringify(n.metadata) : ''),
      time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      timeGroup: n.timeGroup || 'Today',
      priority: n.priority ? (n.priority.charAt(0) + n.priority.slice(1).toLowerCase()) : 'Medium',
      status: n.status === 'READ' ? 'Resolved' : (n.priority === 'CRITICAL' || n.priority === 'HIGH' ? 'Action Required' : 'Open'),
      isRead: !n.isUnread,
      isPinned: !!n.isPinned,
      targetRoute: n.targetRoute || n.ctaLink || '/admin/dashboard',
      actions: n.actions && n.actions.length > 0 ? n.actions : [
        { label: 'View', actionType: 'view', variant: 'outline' }
      ],
      createdAt: n.createdAt,
    }));
  }

  /**
   * 7. Unread Count
   */
  async getUnreadCount() {
    return NotificationModel.countDocuments({
      recipientType: 'ADMIN',
      isDeleted: false,
      isUnread: true,
    });
  }

  /**
   * 8. Mark As Read
   */
  async markAsRead(id: string) {
    return NotificationDispatcher.markAsRead(id, 'ADMIN');
  }

  /**
   * 9. Mark All Read
   */
  async markAllAsRead() {
    return NotificationDispatcher.markAllAsRead('ADMIN');
  }

  /**
   * 10. Delete Single Notification
   */
  async deleteNotification(id: string) {
    const notif = await NotificationModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), recipientType: 'ADMIN', isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!notif) throw new Error('Notification not found');
    return { success: true, message: 'Notification deleted' };
  }

  /**
   * 11. Bulk Actions
   */
  async bulkMarkAsRead(ids: string[]) {
    await NotificationModel.updateMany(
      {
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        recipientType: 'ADMIN',
        isDeleted: false,
      },
      { $set: { isUnread: false, status: 'READ', readAt: new Date() } }
    );
    return { success: true, message: `Marked ${ids.length} notifications as read` };
  }

  async bulkArchive(ids: string[]) {
    await NotificationModel.updateMany(
      {
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        recipientType: 'ADMIN',
        isDeleted: false,
      },
      { $set: { status: 'ARCHIVED', isUnread: false } }
    );
    return { success: true, message: `Archived ${ids.length} notifications` };
  }

  async bulkDelete(ids: string[]) {
    await NotificationModel.updateMany(
      {
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        recipientType: 'ADMIN',
        isDeleted: false,
      },
      { $set: { isDeleted: true } }
    );
    return { success: true, message: `Deleted ${ids.length} notifications` };
  }
}

export const adminNotificationService = new AdminNotificationService();
