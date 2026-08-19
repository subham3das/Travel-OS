import {
  HeaderNotificationItem,
  HeaderNotificationCategory,
  HeaderNotificationPriority,
} from '../types/headerNotification';
import { initialHeaderNotifications } from '../data/headerNotificationsData';

const STORAGE_KEY = 'apnatrip_admin_header_notifications';

class AdminHeaderNotificationsService {
  private notifications: HeaderNotificationItem[] = [];
  private listeners: Set<(items: HeaderNotificationItem[]) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
        return;
      }
    } catch {
      // ignore
    }
    this.notifications = [...initialHeaderNotifications];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch {
      // ignore
    }
    this.notifyListeners();
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
    this.saveToStorage();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.saveToStorage();
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.notifications = [...initialHeaderNotifications];
    this.saveToStorage();
  }

  public executeAction(
    id: string,
    actionType: string
  ): { success: boolean; message: string } {
    const target = this.notifications.find((n) => n.id === id);
    if (!target) return { success: false, message: 'Notification not found' };

    // Automatically mark as read when an action is executed
    this.markAsRead(id);

    switch (actionType) {
      case 'approve_agency':
        return {
          success: true,
          message: `Agency application approved for ${target.meta?.entityName || 'agency'}`,
        };
      case 'reject_agency':
        return {
          success: true,
          message: `Agency application rejected for ${target.meta?.entityName || 'agency'}`,
        };
      case 'approve_package':
        return {
          success: true,
          message: `Package successfully approved and published to catalog`,
        };
      case 'reject_package':
        return {
          success: true,
          message: `Package rejected and sent back to agency for corrections`,
        };
      case 'verify_booking':
        return {
          success: true,
          message: `VIP Booking verified and confirmation dispatched`,
        };
      case 'retry_payment':
        return {
          success: true,
          message: `Payment gateway retry triggered for ${target.meta?.amount || 'transaction'}`,
        };
      case 'refund_payment':
        return {
          success: true,
          message: `Refund initiated for ${target.meta?.amount || 'transaction'}`,
        };
      case 'assign_ticket':
        return {
          success: true,
          message: `Ticket assigned to Priority Support tier`,
        };
      case 'approve_review':
        return {
          success: true,
          message: `Review moderation cleared and approved`,
        };
      case 'reject_review':
        return {
          success: true,
          message: `Flagged review removed from public listing`,
        };
      case 'take_down_post':
        return {
          success: true,
          message: `Spam post removed from community feed`,
        };
      case 'dismiss_post':
        return {
          success: true,
          message: `Flag dismissed and post retained`,
        };
      case 'investigate_security':
        return {
          success: true,
          message: `Security incident flagged for SOC investigation`,
        };
      default:
        return {
          success: true,
          message: `Action executed successfully`,
        };
    }
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
    this.saveToStorage();
  }
}

export const adminHeaderNotificationsService = new AdminHeaderNotificationsService();
