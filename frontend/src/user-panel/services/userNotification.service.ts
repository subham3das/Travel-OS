import { apiClient } from '../../services/apiClient';
import { NotificationItem } from '../data/notifications';

class UserNotificationService {
  /**
   * Fetch all notifications for the current authenticated user
   */
  public async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await apiClient.get<{ notifications: NotificationItem[] }>('/notifications/my');
      return res.data?.notifications || [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch unread notification count for badge display
   */
  public async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
      return res.data?.unreadCount || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Mark a single notification as read
   */
  public async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${encodeURIComponent(id)}/read`);
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  }
}

export const userNotificationService = new UserNotificationService();
