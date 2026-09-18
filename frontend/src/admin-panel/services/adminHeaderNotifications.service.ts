import {
  HeaderNotificationItem,
  HeaderNotificationCategory,
  HeaderNotificationPriority,
} from '../types/headerNotification';
import { adminApiClient } from './adminApiClient';
import { adminSocketService } from './adminSocket.service';

export const initialHeaderNotifications: HeaderNotificationItem[] = [];

class AdminHeaderNotificationsService {
  private notifications: HeaderNotificationItem[] = [];
  private listeners: Set<(items: HeaderNotificationItem[]) => void> = new Set();
  private socketCleanup: (() => void) | null = null;

  constructor() {
    this.fetchLive();
    this.initSocketListeners();
  }

  /**
   * Initialize real-time Socket.IO listeners for live notification updates
   */
  private initSocketListeners() {
    // Listen for new notifications pushed from backend
    const cleanupNew = adminSocketService.onNotificationNew((notification: any) => {
      const newItem: HeaderNotificationItem = {
        id: notification.id || notification._id,
        category: (notification.category || 'system').toLowerCase() as HeaderNotificationCategory,
        title: notification.title,
        description: notification.description,
        timestamp: notification.timestamp || 'Just now',
        timeGroup: notification.timeGroup || 'Today',
        priority: notification.priority || 'MEDIUM',
        isRead: false,
        targetRoute: notification.targetRoute || notification.ctaLink || '/admin/dashboard',
        actions: notification.actions && notification.actions.length > 0
          ? notification.actions
          : [{ label: 'View', actionType: 'view', variant: 'secondary' }],
      };

      this.notifications = [newItem, ...this.notifications];
      this.notifyListeners();
    });

    // Listen for individual notification read state changes
    const cleanupRead = adminSocketService.onNotificationRead((data) => {
      this.notifications = this.notifications.map((n) =>
        n.id === data.id ? { ...n, isRead: true } : n
      );
      this.notifyListeners();
    });

    // Listen for mark-all-read broadcast
    const cleanupReadAll = adminSocketService.onNotificationReadAll(() => {
      this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
      this.notifyListeners();
    });

    this.socketCleanup = () => {
      cleanupNew();
      cleanupRead();
      cleanupReadAll();
    };
  }

  public async fetchLive() {
    try {
      const response = await adminApiClient.get<HeaderNotificationItem[]>('/notifications/header');
      if (response.success && response.data) {
        this.notifications = response.data;
        this.notifyListeners();
      }
    } catch {
      // ignore — keep current state
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  public subscribe(listener: (items: HeaderNotificationItem[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getNotifications(): HeaderNotificationItem[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifyListeners();

    // Fire-and-forget backend call
    adminApiClient.patch(`/notifications/${id}/read`).catch(() => {});
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notifyListeners();

    // Fire-and-forget backend call
    adminApiClient.post('/notifications/read-all').catch(() => {});
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyListeners();

    // Fire-and-forget backend call
    adminApiClient.delete(`/notifications/${id}`).catch(() => {});
  }

  public resetToDefault(): void {
    this.fetchLive();
  }

  public executeAction(
    id: string,
    actionType: string
  ): { success: boolean; message: string } {
    this.markAsRead(id);
    return {
      success: true,
      message: `Action ${actionType} executed successfully`,
    };
  }

  public addLiveNotification(item: {
    category: HeaderNotificationCategory;
    title: string;
    description: string;
    priority: HeaderNotificationPriority;
    targetRoute: string;
    actions?: HeaderNotificationItem['actions'];
  }): void {
    const newItem: HeaderNotificationItem = {
      id: `notif-live-${Date.now()}`,
      category: item.category,
      title: item.title,
      description: item.description,
      timestamp: 'Just now',
      timeGroup: 'Today',
      priority: item.priority,
      isRead: false,
      targetRoute: item.targetRoute,
      actions: item.actions,
    };
    this.notifications = [newItem, ...this.notifications];
    this.notifyListeners();
  }
}

export const adminHeaderNotificationsService = new AdminHeaderNotificationsService();
