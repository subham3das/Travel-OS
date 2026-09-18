import { agencyApiClient } from './agencyApiClient';
import { AgencyNotification } from '../data/notifications';

export interface GetNotificationsParams {
  category?: string;
  readStatus?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest';
}

export interface NotificationsResponse {
  notifications: AgencyNotification[];
  groupedNotifications: { dateGroup: string; items: AgencyNotification[] }[];
  unreadCount: number;
  tabCounts: Record<string, number>;
}

export const agencyNotificationsService = {
  /**
   * Fetch agency activity inbox notifications
   */
  async getNotifications(params?: GetNotificationsParams): Promise<NotificationsResponse> {
    const res = await agencyApiClient.get<NotificationsResponse>('/agency/notifications', { params: params as any });
    if (!res.data) throw new Error(res.message || 'Failed to fetch notifications');
    return res.data;
  },

  /**
   * Mark single notification as read or unread
   */
  async markAsRead(id: string, isUnread = false): Promise<{ id: string; isUnread: boolean; status: string }> {
    const res = await agencyApiClient.patch<{ id: string; isUnread: boolean; status: string }>(
      `/agency/notifications/${id}/read`,
      { isUnread }
    );
    if (!res.data) throw new Error(res.message || 'Failed to update notification');
    return res.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const res = await agencyApiClient.post<{ success: boolean }>('/agency/notifications/read-all', {});
    if (!res.success) throw new Error(res.message || 'Failed to mark all as read');
  },

  /**
   * Clear all read notifications
   */
  async clearAllRead(): Promise<void> {
    const res = await agencyApiClient.post<{ success: boolean }>('/agency/notifications/clear-read', {});
    if (!res.success) throw new Error(res.message || 'Failed to clear read notifications');
  },

  /**
   * Delete single notification
   */
  async deleteNotification(id: string): Promise<void> {
    const res = await agencyApiClient.delete<{ success: boolean }>(`/agency/notifications/${id}`);
    if (!res.success) throw new Error(res.message || 'Failed to delete notification');
  },

  /**
   * Archive single notification
   */
  async archiveNotification(id: string): Promise<void> {
    const res = await agencyApiClient.patch<{ success: boolean }>(`/agency/notifications/${id}/archive`, {});
    if (!res.success) throw new Error(res.message || 'Failed to archive notification');
  },
};
