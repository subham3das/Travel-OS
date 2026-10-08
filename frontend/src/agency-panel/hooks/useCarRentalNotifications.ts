// ─── useCarRentalNotifications Hook ──────────────────────────────────────────
// Mirrors useNotifications.ts but uses carRentalNotificationsService.
// Tabs adapted for Car Rental context: All | Unread | Bookings | Payments | Fleet | Drivers | Reviews | Admin

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CarRentalNotification,
  carRentalNotificationsService,
} from '../services/carRentalNotifications.service';

export type CarRentalNotificationTab =
  | 'All'
  | 'Unread'
  | 'Bookings'
  | 'Payments'
  | 'Fleet'
  | 'Drivers'
  | 'Reviews'
  | 'Admin';

export interface CarRentalNotificationFiltersState {
  category: string;
  readStatus: string;
  sortBy: 'newest' | 'oldest';
}

export function useCarRentalNotifications() {
  const [notifications, setNotifications] = useState<CarRentalNotification[]>([]);
  const [activeTab, setActiveTab] = useState<CarRentalNotificationTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<CarRentalNotification | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<CarRentalNotificationFiltersState>({
    category: 'ALL',
    readStatus: 'ALL',
    sortBy: 'newest',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await carRentalNotificationsService.getNotifications({
        category: filters.category !== 'ALL' ? filters.category : undefined,
        readStatus: filters.readStatus !== 'ALL' ? filters.readStatus : undefined,
        search: searchTerm || undefined,
        sortBy: filters.sortBy,
      });
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch Car Rental notifications:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread && n.status !== 'ARCHIVED').length,
    [notifications]
  );

  const tabCounts = useMemo(() => {
    const active = notifications.filter((n) => n.status !== 'ARCHIVED');
    return {
      All: active.length,
      Unread: active.filter((n) => n.isUnread).length,
      Bookings: active.filter((n) => /bookings?/i.test(n.category)).length,
      Payments: active.filter((n) => /payments?/i.test(n.category)).length,
      Fleet: active.filter((n) => /fleet|vehicle|car/i.test(n.category)).length,
      Drivers: active.filter((n) => /driver/i.test(n.category)).length,
      Reviews: active.filter((n) => /reviews?/i.test(n.category)).length,
      Admin: active.filter((n) => /admin/i.test(n.category)).length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => n.status !== 'ARCHIVED')
      .filter((n) => {
        if (activeTab === 'Unread' && !n.isUnread) return false;
        if (activeTab === 'Bookings' && !/bookings?/i.test(n.category)) return false;
        if (activeTab === 'Payments' && !/payments?/i.test(n.category)) return false;
        if (activeTab === 'Fleet' && !/fleet|vehicle|car/i.test(n.category)) return false;
        if (activeTab === 'Drivers' && !/driver/i.test(n.category)) return false;
        if (activeTab === 'Reviews' && !/reviews?/i.test(n.category)) return false;
        if (activeTab === 'Admin' && !/admin/i.test(n.category)) return false;

        if (filters.category !== 'ALL' && !new RegExp(filters.category, 'i').test(n.category)) return false;
        if (filters.readStatus === 'UNREAD' && !n.isUnread) return false;
        if (filters.readStatus === 'READ' && n.isUnread) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          return (
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            (n.relatedEntityId || '').toLowerCase().includes(q) ||
            (n.relatedEntityName || '').toLowerCase().includes(q) ||
            (n.triggeredBy || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) =>
        filters.sortBy === 'oldest'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [notifications, activeTab, filters, searchTerm]);

  const groupedNotifications = useMemo(() => {
    const groups: { dateGroup: string; items: CarRentalNotification[] }[] = [
      { dateGroup: 'Today', items: [] },
      { dateGroup: 'Yesterday', items: [] },
      { dateGroup: 'This Week', items: [] },
      { dateGroup: 'Earlier', items: [] },
    ];
    filteredNotifications.forEach((item) => {
      const g = groups.find((grp) => grp.dateGroup === item.dateGroup);
      if (g) g.items.push(item);
      else groups.push({ dateGroup: item.dateGroup || 'Today', items: [item] });
    });
    return groups.filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  /* ── Actions ── */

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false, status: 'READ' as const } : n))
    );
    if (selectedNotification?.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: false, status: 'READ' as const } : null));
    }
    try {
      await carRentalNotificationsService.markAsRead(id, false);
    } catch (e) {
      console.error('Failed to sync markAsRead:', e);
    }
  };

  const markAsUnread = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: true, status: 'UNREAD' as const } : n))
    );
    if (selectedNotification?.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: true, status: 'UNREAD' as const } : null));
    }
    try {
      await carRentalNotificationsService.markAsRead(id, true);
    } catch (e) {
      console.error('Failed to sync markAsUnread:', e);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false, status: 'READ' as const }))
    );
    try {
      await carRentalNotificationsService.markAllAsRead();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const clearAllRead = async () => {
    setNotifications((prev) => prev.filter((n) => n.isUnread));
    try {
      await carRentalNotificationsService.clearAllRead();
    } catch (e) {
      console.error('Failed to clear read notifications:', e);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
    try {
      await carRentalNotificationsService.deleteNotification(id);
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
  };

  const archiveNotification = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'ARCHIVED' as const } : n))
    );
    if (selectedNotification?.id === id) setSelectedNotification(null);
    try {
      await carRentalNotificationsService.archiveNotification(id);
    } catch (e) {
      console.error('Failed to archive notification:', e);
    }
  };

  return {
    notifications: filteredNotifications,
    groupedNotifications,
    unreadCount,
    tabCounts,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedNotification,
    setSelectedNotification,
    isFilterModalOpen,
    setIsFilterModalOpen,
    filters,
    setFilters,
    isLoading,
    isError,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAllRead,
    deleteNotification,
    archiveNotification,
    refreshNotifications: fetchNotifications,
  };
}
