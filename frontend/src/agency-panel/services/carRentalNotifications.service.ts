// ─── Car Rental Notifications API Service ─────────────────────────────────────
// Mirrors agencyNotifications.service.ts but uses /agencies/car-rental/notifications/* endpoints.

import { agencyApiClient } from './agencyApiClient';

export interface CarRentalNotification {
  id: string;
  category: string;
  title: string;
  description: string;
  timestamp: string;
  dateGroup: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
  createdAt: string;
  isUnread: boolean;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  relatedEntityType?: string;
  relatedEntityId?: string;
  relatedEntityName?: string;
  triggeredBy?: string;
  ctaText?: string;
  ctaLink?: string;
  priority?: string;
}

export interface CarRentalNotificationsResponse {
  notifications: CarRentalNotification[];
  groupedNotifications: { dateGroup: string; items: CarRentalNotification[] }[];
  unreadCount: number;
  tabCounts: Record<string, number>;
}

export interface GetCarRentalNotificationsParams {
  category?: string;
  readStatus?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest';
}

export const carRentalNotificationsService = {
  /**
   * Fetch car-rental notifications (scoped to businessType: 'car_rental')
   */
  async getNotifications(
    params?: GetCarRentalNotificationsParams
  ): Promise<CarRentalNotificationsResponse> {
    const res = await agencyApiClient.get<CarRentalNotificationsResponse>(
      '/agencies/car-rental/notifications',
      { params: params as any }
    );
    if (!res.data) throw new Error(res.message || 'Failed to fetch notifications');
    return res.data;
  },

  /**
   * Mark a single notification as read or unread
   */
  async markAsRead(
    id: string,
    isUnread = false
  ): Promise<{ id: string; isUnread: boolean; status: string }> {
    const res = await agencyApiClient.patch<{ id: string; isUnread: boolean; status: string }>(
      `/agencies/car-rental/notifications/${id}/read`,
      { isUnread }
    );
    if (!res.data) throw new Error(res.message || 'Failed to update notification');
    return res.data;
  },

  /**
   * Mark all car-rental notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await agencyApiClient.post('/agencies/car-rental/notifications/read-all', {});
  },

  /**
   * Clear all read car-rental notifications
   */
  async clearAllRead(): Promise<void> {
    await agencyApiClient.post('/agencies/car-rental/notifications/clear-read', {});
  },

  /**
   * Delete a single car-rental notification
   */
  async deleteNotification(id: string): Promise<void> {
    await agencyApiClient.delete(`/agencies/car-rental/notifications/${id}`);
  },

  /**
   * Archive a single car-rental notification
   */
  async archiveNotification(id: string): Promise<void> {
    await agencyApiClient.patch(`/agencies/car-rental/notifications/${id}/archive`, {});
  },
};
