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
import {
  initialNotificationCenterKPIs,
  initialSmartGroups,
  initialSavedFilters,
  initialPinnedNotifications,
  initialAISummary,
  initialNotificationPreferences,
  initialNotificationFeedItems,
  initialBottomWidgetsData,
} from '../data/advancedNotificationCenterData';

const STORAGE_KEY = 'apnatrip_admin_advanced_notifications_feed';

class AdvancedNotificationCenterService {
  private feedItems: NotificationFeedItem[] = [];
  private kpiStats: NotificationCenterKPISummary = initialNotificationCenterKPIs;
  private smartGroups: SmartGroupItem[] = initialSmartGroups;
  private savedFilters: SavedFilterItem[] = initialSavedFilters;
  private pinnedNotifications: PinnedNotificationItem[] = initialPinnedNotifications;
  private aiSummary: AISummaryData = initialAISummary;
  private preferences: NotificationPreferencesData = initialNotificationPreferences;
  private bottomWidgets: NotificationBottomWidgetsData = initialBottomWidgetsData;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.feedItems = JSON.parse(stored);
        return;
      }
    } catch {
      // ignore
    }
    this.feedItems = [...initialNotificationFeedItems];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.feedItems));
    } catch {
      // ignore
    }
  }

  public async getKPIs(): Promise<NotificationCenterKPISummary> {
    const unreadCount = this.feedItems.filter((i) => !i.isRead).length;
    const criticalCount = this.feedItems.filter(
      (i) => i.priority === 'High' || i.priority === 'Critical'
    ).length;
    const actionRequiredCount = this.feedItems.filter(
      (i) => i.status === 'Action Required' || i.status === 'Open'
    ).length;

    return {
      ...this.kpiStats,
      unread: { count: unreadCount, label: 'Unread Notifications' },
      criticalAlerts: { count: criticalCount, label: 'High Priority' },
      actionRequired: { count: actionRequiredCount, label: 'Need Immediate Action' },
    };
  }

  public async getSmartGroups(): Promise<SmartGroupItem[]> {
    return this.smartGroups;
  }

  public async getSavedFilters(): Promise<SavedFilterItem[]> {
    return this.savedFilters;
  }

  public async getPinnedNotifications(): Promise<PinnedNotificationItem[]> {
    return this.pinnedNotifications;
  }

  public async getAISummary(): Promise<AISummaryData> {
    return this.aiSummary;
  }

  public async getPreferences(): Promise<NotificationPreferencesData> {
    return this.preferences;
  }

  public async updatePreferences(
    partial: Partial<NotificationPreferencesData>
  ): Promise<NotificationPreferencesData> {
    this.preferences = { ...this.preferences, ...partial };
    return this.preferences;
  }

  public async getBottomWidgets(): Promise<NotificationBottomWidgetsData> {
    return this.bottomWidgets;
  }

  public async getFeedItems(
    category: NotificationCategoryType = 'all',
    searchQuery: string = '',
    selectedGroupId?: string,
    selectedFilterId?: string
  ): Promise<NotificationFeedItem[]> {
    let items = [...this.feedItems];

    // Filter by Tab Category
    if (category === 'unread') {
      items = items.filter((i) => !i.isRead);
    } else if (category === 'critical') {
      items = items.filter((i) => i.priority === 'High' || i.priority === 'Critical');
    } else if (category !== 'all') {
      items = items.filter((i) => i.category === category);
    }

    // Filter by Smart Group
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

    // Filter by Saved Filter
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

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.metadata.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }

    return items;
  }

  public async markAsRead(id: string): Promise<void> {
    this.feedItems = this.feedItems.map((i) => (i.id === id ? { ...i, isRead: true } : i));
    this.saveToStorage();
  }

  public async executeInlineAction(
    id: string,
    actionType: string
  ): Promise<{ success: boolean; message: string }> {
    const item = this.feedItems.find((i) => i.id === id);
    if (!item) return { success: false, message: 'Notification not found' };

    await this.markAsRead(id);

    switch (actionType) {
      case 'approve_agency':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Agency KYC approved and status updated to Active' };
      case 'reject_agency':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Agency application rejected with remarks sent' };
      case 'review_package':
        return { success: true, message: 'Package review modal opened for moderation' };
      case 'reject_package':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Package rejected with revision notes sent to agency' };
      case 'retry_payment':
        return { success: true, message: 'Payment gateway retry command triggered' };
      case 'remove_review':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Reported abusive review deleted from listings' };
      case 'ignore_review':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Review report ignored and post retained' };
      case 'approve_refund':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Customer refund approved and initiated to bank' };
      case 'delete_post':
        this.feedItems = this.feedItems.map((i) =>
          i.id === id ? { ...i, status: 'Resolved' } : i
        );
        this.saveToStorage();
        return { success: true, message: 'Violating community post permanently taken down' };
      default:
        return { success: true, message: 'Action executed successfully' };
    }
  }

  public async bulkMarkAsRead(ids: string[]): Promise<void> {
    this.feedItems = this.feedItems.map((i) =>
      ids.includes(i.id) ? { ...i, isRead: true } : i
    );
    this.saveToStorage();
  }

  public async bulkArchive(ids: string[]): Promise<void> {
    this.feedItems = this.feedItems.map((i) =>
      ids.includes(i.id) ? { ...i, status: 'Archived', isRead: true } : i
    );
    this.saveToStorage();
  }

  public async bulkDelete(ids: string[]): Promise<void> {
    this.feedItems = this.feedItems.filter((i) => !ids.includes(i.id));
    this.saveToStorage();
  }

  public async createNotification(newItem: {
    category: NotificationCategoryType;
    title: string;
    description: string;
    metadata: string;
    priority: NotificationFeedItem['priority'];
    targetRoute: string;
  }): Promise<NotificationFeedItem> {
    const created: NotificationFeedItem = {
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

    this.feedItems = [created, ...this.feedItems];
    this.saveToStorage();
    return created;
  }
}

export const advancedNotificationCenterService = new AdvancedNotificationCenterService();
