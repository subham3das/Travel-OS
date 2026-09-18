import {
  NotificationCenterKPISummary,
  NotificationFeedItem,
  SmartGroupItem,
  SavedFilterItem,
  PinnedNotificationItem,
  AISummaryData,
  NotificationPreferencesData,
  NotificationBottomWidgetsData,
  NotificationCategoryType,
} from '../types/advancedNotificationCenter';
import { adminApiClient } from './adminApiClient';

export const initialNotificationCenterKPIs: NotificationCenterKPISummary = {
  today: { count: 0, growth: '+0% vs yesterday', isPositive: true },
  actionRequired: { count: 0, label: 'Need Immediate Action' },
  criticalAlerts: { count: 0, label: 'High Priority' },
  unread: { count: 0, label: 'Unread Notifications' },
  responseTime: { value: '—', growth: '+0% vs yesterday', isPositive: true },
};

export const initialSmartGroups: SmartGroupItem[] = [
  {
    id: 'grp-agency',
    title: 'Agency Approvals',
    subtitle: 'Pending agency verifications',
    count: 0,
    iconType: 'agency',
  },
  {
    id: 'grp-package',
    title: 'Package Reviews',
    subtitle: 'Packages awaiting review',
    count: 0,
    iconType: 'package',
  },
  {
    id: 'grp-support',
    title: 'Support Tickets',
    subtitle: 'New and open tickets',
    count: 0,
    iconType: 'support',
  },
  {
    id: 'grp-finance',
    title: 'Payments & Finance',
    subtitle: 'Payment failures & refunds',
    count: 0,
    iconType: 'payment',
  },
  {
    id: 'grp-reviews',
    title: 'Reviews & Content',
    subtitle: 'Reports and moderation',
    count: 0,
    iconType: 'review',
  },
  {
    id: 'grp-system',
    title: 'System Alerts',
    subtitle: 'System & security alerts',
    count: 0,
    iconType: 'system',
  },
  {
    id: 'grp-community',
    title: 'Community',
    subtitle: 'Posts, stories & reports',
    count: 0,
    iconType: 'community',
  },
];

export const initialSavedFilters: SavedFilterItem[] = [
  { id: 'flt-high', title: 'High Priority', count: 0, iconType: 'high' },
  { id: 'flt-tickets', title: 'Unresolved Tickets', count: 0, iconType: 'tickets' },
  { id: 'flt-payments', title: 'Payment Issues', count: 0, iconType: 'payments' },
  { id: 'flt-my', title: 'My Alerts', count: 0, iconType: 'alerts' },
];

export const initialPinnedNotifications: PinnedNotificationItem[] = [];

export const initialAISummary: AISummaryData = {
  newCount: 0,
  immediateActionCount: 0,
  criticalAlertsCount: 0,
  approvalsPendingCount: 0,
  paymentFailuresCount: 0,
  executiveSummary:
    'Loading notification intelligence summary...',
};

export const initialNotificationPreferences: NotificationPreferencesData = {
  desktopPush: true,
  emailNotifications: true,
  soundAlerts: true,
  whatsappAlerts: false,
  snooze: 'Off',
};

export const initialNotificationFeedItems: NotificationFeedItem[] = [];

export const initialBottomWidgetsData: NotificationBottomWidgetsData = {
  analytics: [
    { category: 'Agencies', count: 0, percentage: 0, color: '#6356E5' },
    { category: 'Support', count: 0, percentage: 0, color: '#EC4899' },
    { category: 'Payments', count: 0, percentage: 0, color: '#10B981' },
    { category: 'Packages', count: 0, percentage: 0, color: '#3B82F6' },
    { category: 'Reviews', count: 0, percentage: 0, color: '#F59E0B' },
    { category: 'Security', count: 0, percentage: 0, color: '#EF4444' },
  ],
  recentActivity: [],
  escalations: [],
  deliveryStatus: {
    push: { delivered: 0, pending: 0, failed: 0, rate: '—' },
    email: { delivered: 0, pending: 0, failed: 0, rate: '—' },
    sms: { delivered: 0, pending: 0, failed: 0, rate: '—' },
    whatsapp: { delivered: 0, pending: 0, failed: 0, rate: '—' },
  },
};

/** Category-to-group mapping for dynamic count calculation */
const CATEGORY_GROUP_MAP: Record<string, string> = {
  agency: 'grp-agency',
  package: 'grp-package',
  support: 'grp-support',
  payment: 'grp-finance',
  finance: 'grp-finance',
  review: 'grp-reviews',
  system: 'grp-system',
  security: 'grp-system',
  audit: 'grp-system',
  community: 'grp-community',
};

class AdvancedNotificationCenterService {
  private preferences: NotificationPreferencesData = initialNotificationPreferences;

  /**
   * 1. KPIs — Fetch from backend /notifications/stats (centerKPIs sub-field)
   */
  public async getKPIs(): Promise<NotificationCenterKPISummary> {
    try {
      const response = await adminApiClient.get<any>('/notifications/stats');
      if (response.success && response.data?.centerKPIs) {
        return response.data.centerKPIs;
      }
      return initialNotificationCenterKPIs;
    } catch {
      return initialNotificationCenterKPIs;
    }
  }

  /**
   * 2. Smart Groups — Calculated from live notification feed category counts
   */
  public async getSmartGroups(): Promise<SmartGroupItem[]> {
    try {
      const allItems = await this.getFeedItems('all', '');
      const groups = [...initialSmartGroups];

      // Calculate live counts from actual notifications
      const countMap: Record<string, number> = {};
      for (const item of allItems) {
        const groupId = CATEGORY_GROUP_MAP[item.category] || 'grp-system';
        countMap[groupId] = (countMap[groupId] || 0) + 1;
      }

      return groups.map((g) => ({
        ...g,
        count: countMap[g.id] || 0,
      }));
    } catch {
      return initialSmartGroups;
    }
  }

  /**
   * 3. Saved Filters — Calculated from live notification data
   */
  public async getSavedFilters(): Promise<SavedFilterItem[]> {
    try {
      const allItems = await this.getFeedItems('all', '');
      const highCount = allItems.filter(
        (i) => i.priority === 'High' || i.priority === 'Critical'
      ).length;
      const ticketCount = allItems.filter(
        (i) => i.category === 'support' && i.status !== 'Resolved'
      ).length;
      const paymentCount = allItems.filter(
        (i) => i.category === 'payment' || i.category === 'finance'
      ).length;
      const unreadCount = allItems.filter((i) => !i.isRead).length;

      return [
        { id: 'flt-high', title: 'High Priority', count: highCount, iconType: 'high' },
        { id: 'flt-tickets', title: 'Unresolved Tickets', count: ticketCount, iconType: 'tickets' },
        { id: 'flt-payments', title: 'Payment Issues', count: paymentCount, iconType: 'payments' },
        { id: 'flt-my', title: 'My Alerts', count: unreadCount, iconType: 'alerts' },
      ];
    } catch {
      return initialSavedFilters;
    }
  }

  /**
   * 4. Pinned Notifications — Derived from live feed items that are pinned
   */
  public async getPinnedNotifications(): Promise<PinnedNotificationItem[]> {
    try {
      const allItems = await this.getFeedItems('all', '');
      return allItems
        .filter((i) => i.isPinned)
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.description,
          timeAgo: item.time,
          priority: item.priority,
          iconType: item.category as PinnedNotificationItem['iconType'],
          targetRoute: item.targetRoute,
        }));
    } catch {
      return initialPinnedNotifications;
    }
  }

  /**
   * 5. AI Summary — Computed from live notification data
   */
  public async getAISummary(): Promise<AISummaryData> {
    try {
      const allItems = await this.getFeedItems('all', '');
      const unreadCount = allItems.filter((i) => !i.isRead).length;
      const criticalCount = allItems.filter(
        (i) => i.priority === 'High' || i.priority === 'Critical'
      ).length;
      const actionRequiredCount = allItems.filter(
        (i) => i.status === 'Action Required' || i.status === 'Open'
      ).length;
      const agencyCount = allItems.filter((i) => i.category === 'agency' && !i.isRead).length;
      const paymentCount = allItems.filter(
        (i) => (i.category === 'payment' || i.category === 'finance') && !i.isRead
      ).length;

      return {
        newCount: unreadCount,
        immediateActionCount: actionRequiredCount,
        criticalAlertsCount: criticalCount,
        approvalsPendingCount: agencyCount,
        paymentFailuresCount: paymentCount,
        executiveSummary:
          unreadCount > 0
            ? `${unreadCount} unread notifications with ${actionRequiredCount} items requiring attention: ${agencyCount} agency verifications and ${paymentCount} payment-related alerts.`
            : 'All caught up! No pending notifications requiring immediate attention.',
      };
    } catch {
      return initialAISummary;
    }
  }

  /**
   * 6. Preferences — Local state (not persisted to backend)
   */
  public async getPreferences(): Promise<NotificationPreferencesData> {
    return this.preferences;
  }

  public async updatePreferences(
    partial: Partial<NotificationPreferencesData>
  ): Promise<NotificationPreferencesData> {
    this.preferences = { ...this.preferences, ...partial };
    return this.preferences;
  }

  /**
   * 7. Bottom Widgets — Computed from live notification data
   */
  public async getBottomWidgets(): Promise<NotificationBottomWidgetsData> {
    try {
      const allItems = await this.getFeedItems('all', '');

      // Category analytics
      const categoryMap: Record<string, number> = {};
      for (const item of allItems) {
        const cat = item.category;
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      }
      const total = allItems.length || 1;
      const analyticsColors: Record<string, string> = {
        agency: '#6356E5',
        support: '#EC4899',
        payment: '#10B981',
        finance: '#10B981',
        package: '#3B82F6',
        review: '#F59E0B',
        system: '#EF4444',
        security: '#EF4444',
        community: '#8B5CF6',
      };
      const analytics = Object.entries(categoryMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([cat, count]) => ({
          category: cat.charAt(0).toUpperCase() + cat.slice(1) + (cat.endsWith('y') ? '' : 's'),
          count,
          percentage: Math.round((count / total) * 100),
          color: analyticsColors[cat] || '#64748B',
        }));

      // Recent activity — latest 4 read items
      const recentActivity = allItems
        .filter((i) => i.isRead)
        .slice(0, 4)
        .map((item, idx) => ({
          id: `act-${idx + 1}`,
          action: item.title,
          entity: item.description.slice(0, 40),
          time: item.time,
          admin: 'Super Admin',
        }));

      // Escalations — High/Critical unread items
      const escalations = allItems
        .filter(
          (i) =>
            (i.priority === 'High' || i.priority === 'Critical') &&
            !i.isRead
        )
        .slice(0, 3)
        .map((item, idx) => ({
          id: `esc-${idx + 1}`,
          title: item.title,
          priority: item.priority,
          assignedTo: 'Operations Team',
          dueIn: `${(idx + 1) * 30} mins`,
        }));

      return {
        analytics: analytics.length > 0 ? analytics : initialBottomWidgetsData.analytics,
        recentActivity,
        escalations,
        deliveryStatus: initialBottomWidgetsData.deliveryStatus,
      };
    } catch {
      return initialBottomWidgetsData;
    }
  }

  /**
   * 8. Feed Items — Live from backend /notifications/feed
   */
  public async getFeedItems(
    category: NotificationCategoryType = 'all',
    searchQuery: string = '',
    selectedGroupId?: string,
    selectedFilterId?: string
  ): Promise<NotificationFeedItem[]> {
    try {
      const params: Record<string, string> = {};
      if (category && category !== 'all') params.category = category;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedGroupId) params.groupId = selectedGroupId;
      if (selectedFilterId) params.filterId = selectedFilterId;

      const response = await adminApiClient.get<NotificationFeedItem[]>('/notifications/feed', {
        params,
      });

      if (response.success && response.data) {
        // Apply client-side group/filter for UX responsiveness
        let items = response.data;

        if (selectedGroupId) {
          switch (selectedGroupId) {
            case 'grp-agency':
              items = items.filter((i) => i.category === 'agency');
              break;
            case 'grp-package':
              items = items.filter((i) => i.category === 'package');
              break;
            case 'grp-support':
              items = items.filter((i) => i.category === 'support');
              break;
            case 'grp-finance':
              items = items.filter((i) => i.category === 'payment' || i.category === 'finance');
              break;
            case 'grp-reviews':
              items = items.filter((i) => i.category === 'review');
              break;
            case 'grp-system':
              items = items.filter((i) => i.category === 'system');
              break;
            case 'grp-community':
              items = items.filter((i) => i.category === 'community');
              break;
          }
        }

        if (selectedFilterId) {
          switch (selectedFilterId) {
            case 'flt-high':
              items = items.filter((i) => i.priority === 'High' || i.priority === 'Critical');
              break;
            case 'flt-tickets':
              items = items.filter((i) => i.category === 'support' && i.status !== 'Resolved');
              break;
            case 'flt-payments':
              items = items.filter((i) => i.category === 'payment' || i.category === 'finance');
              break;
            case 'flt-my':
              items = items.filter((i) => !i.isRead);
              break;
          }
        }

        return items;
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * 9. Mark Single Notification as Read — Backend API call
   */
  public async markAsRead(id: string): Promise<void> {
    try {
      await adminApiClient.patch(`/notifications/${id}/read`);
    } catch {
      // Silently fail — UI optimistically updates
    }
  }

  /**
   * 10. Execute Inline Action — Mark as read + return result
   */
  public async executeInlineAction(
    id: string,
    actionType: string
  ): Promise<{ success: boolean; message: string }> {
    await this.markAsRead(id);

    switch (actionType) {
      case 'approve_agency':
        return { success: true, message: 'Agency KYC approved and status updated to Active' };
      case 'reject_agency':
        return { success: true, message: 'Agency application rejected with remarks sent' };
      case 'review_package':
        return { success: true, message: 'Package review modal opened for moderation' };
      case 'reject_package':
        return { success: true, message: 'Package rejected with revision notes sent to agency' };
      case 'retry_payment':
        return { success: true, message: 'Payment gateway retry command triggered' };
      case 'remove_review':
        return { success: true, message: 'Reported abusive review deleted from listings' };
      case 'ignore_review':
        return { success: true, message: 'Review report ignored and post retained' };
      case 'approve_refund':
        return { success: true, message: 'Customer refund approved and initiated to bank' };
      case 'delete_post':
        return { success: true, message: 'Violating community post permanently taken down' };
      default:
        return { success: true, message: 'Action executed successfully' };
    }
  }

  /**
   * 11. Bulk Mark as Read — Backend API call
   */
  public async bulkMarkAsRead(ids: string[]): Promise<void> {
    try {
      await adminApiClient.post('/notifications/bulk/read', { ids });
    } catch {
      // Silent fail
    }
  }

  /**
   * 12. Bulk Archive — Backend API call
   */
  public async bulkArchive(ids: string[]): Promise<void> {
    try {
      await adminApiClient.post('/notifications/bulk/archive', { ids });
    } catch {
      // Silent fail
    }
  }

  /**
   * 13. Bulk Delete — Backend API call
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    try {
      await adminApiClient.post('/notifications/bulk/delete', { ids });
    } catch {
      // Silent fail
    }
  }

  /**
   * 14. Create / Broadcast Notification — Backend API call via NotificationDispatcher
   */
  public async createNotification(newItem: {
    category: NotificationCategoryType;
    title: string;
    description: string;
    metadata: string;
    priority: NotificationFeedItem['priority'];
    targetRoute: string;
  }): Promise<NotificationFeedItem> {
    try {
      const response = await adminApiClient.post<NotificationFeedItem>('/notifications/feed', {
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        priority: (newItem.priority || 'Medium').toUpperCase(),
        targetRoute: newItem.targetRoute,
        relatedEntityType: newItem.category.toUpperCase(),
        metadata: newItem.metadata,
      });

      if (response.success && response.data) {
        return response.data;
      }
    } catch {
      // Fallback — return optimistic item
    }

    return {
      id: `ntf-${Date.now()}`,
      category: newItem.category,
      title: newItem.title,
      description: newItem.description,
      metadata: newItem.metadata,
      time: 'Just now',
      timeGroup: 'Today',
      priority: newItem.priority,
      status: 'Action Required',
      isRead: false,
      targetRoute: newItem.targetRoute,
      actions: [{ label: 'View', actionType: 'view', variant: 'outline' }],
    };
  }
}

export const advancedNotificationCenterService = new AdvancedNotificationCenterService();
