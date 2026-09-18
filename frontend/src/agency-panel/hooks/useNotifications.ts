import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AgencyNotification,
  NotificationCategory,
} from '../data/notifications';
import { agencyNotificationsService } from '../services/agencyNotifications.service';

export type NotificationTab =
  | 'All'
  | 'Unread'
  | 'Bookings'
  | 'Payments'
  | 'Trips'
  | 'Announcements'
  | 'Admin'
  | 'Reviews'
  | 'Team';

export interface NotificationFiltersState {
  category: string;
  readStatus: string; // 'ALL' | 'UNREAD' | 'READ'
  sortBy: 'newest' | 'oldest';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AgencyNotification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] =
    useState<AgencyNotification | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<NotificationFiltersState>({
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
      const data = await agencyNotificationsService.getNotifications({
        category: filters.category !== 'ALL' ? filters.category : undefined,
        readStatus: filters.readStatus !== 'ALL' ? filters.readStatus : undefined,
        search: searchTerm || undefined,
        sortBy: filters.sortBy,
      });
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch agency notifications:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Unread Count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread && n.status !== 'ARCHIVED').length;
  }, [notifications]);

  // Tab Badge Counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: notifications.filter((n) => n.status !== 'ARCHIVED').length,
      Unread: unreadCount,
      Bookings: notifications.filter(
        (n) => n.category === 'Bookings' && n.status !== 'ARCHIVED'
      ).length,
      Payments: notifications.filter(
        (n) => n.category === 'Payments' && n.status !== 'ARCHIVED'
      ).length,
      Trips: notifications.filter(
        (n) => n.category === 'Trips' && n.status !== 'ARCHIVED'
      ).length,
      Announcements: notifications.filter(
        (n) => n.category === 'Announcements' && n.status !== 'ARCHIVED'
      ).length,
      Admin: notifications.filter(
        (n) => n.category === 'Admin' && n.status !== 'ARCHIVED'
      ).length,
      Reviews: notifications.filter(
        (n) => n.category === 'Reviews' && n.status !== 'ARCHIVED'
      ).length,
      Team: notifications.filter(
        (n) => n.category === 'Team' && n.status !== 'ARCHIVED'
      ).length,
    };

    return counts;
  }, [notifications, unreadCount]);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => n.status !== 'ARCHIVED')
      .filter((n) => {
        // Tab Filter
        if (activeTab === 'Unread' && !n.isUnread) return false;
        if (activeTab === 'Bookings' && n.category !== 'Bookings') return false;
        if (activeTab === 'Payments' && n.category !== 'Payments') return false;
        if (activeTab === 'Trips' && n.category !== 'Trips') return false;
        if (activeTab === 'Announcements' && n.category !== 'Announcements') return false;
        if (activeTab === 'Admin' && n.category !== 'Admin') return false;
        if (activeTab === 'Reviews' && n.category !== 'Reviews') return false;
        if (activeTab === 'Team' && n.category !== 'Team') return false;

        // Custom Modal Filters
        if (filters.category !== 'ALL' && n.category !== filters.category) return false;
        if (filters.readStatus === 'UNREAD' && !n.isUnread) return false;
        if (filters.readStatus === 'READ' && n.isUnread) return false;

        // Search Term Matching across Title, Description, Entity ID, Entity Name, Triggered By
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const titleMatch = n.title.toLowerCase().includes(q);
          const descMatch = n.description.toLowerCase().includes(q);
          const entityIdMatch = n.relatedEntityId ? n.relatedEntityId.toLowerCase().includes(q) : false;
          const entityNameMatch = n.relatedEntityName ? n.relatedEntityName.toLowerCase().includes(q) : false;
          const triggeredMatch = n.triggeredBy ? n.triggeredBy.toLowerCase().includes(q) : false;

          return titleMatch || descMatch || entityIdMatch || entityNameMatch || triggeredMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notifications, activeTab, filters, searchTerm]);

  // Grouping by Date
  const groupedNotifications = useMemo(() => {
    const groups: { dateGroup: string; items: AgencyNotification[] }[] = [
      { dateGroup: 'Today', items: [] },
      { dateGroup: 'Yesterday', items: [] },
      { dateGroup: 'This Week', items: [] },
      { dateGroup: 'Earlier', items: [] },
    ];

    filteredNotifications.forEach((item) => {
      const g = groups.find((grp) => grp.dateGroup === item.dateGroup);
      if (g) {
        g.items.push(item);
      } else {
        groups.push({ dateGroup: item.dateGroup || 'Today', items: [item] });
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  // Actions
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false, status: 'READ' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: false, status: 'READ' } : null));
    }
    try {
      await agencyNotificationsService.markAsRead(id, false);
    } catch (e) {
      console.error('Failed to sync markAsRead to server:', e);
    }
  };

  const markAsUnread = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: true, status: 'UNREAD' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: true, status: 'UNREAD' } : null));
    }
    try {
      await agencyNotificationsService.markAsRead(id, true);
    } catch (e) {
      console.error('Failed to sync markAsUnread to server:', e);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false, status: 'READ' }))
    );
    try {
      await agencyNotificationsService.markAllAsRead();
    } catch (e) {
      console.error('Failed to sync markAllAsRead to server:', e);
    }
  };

  const clearAllRead = async () => {
    setNotifications((prev) => prev.filter((n) => n.isUnread));
    try {
      await agencyNotificationsService.clearAllRead();
    } catch (e) {
      console.error('Failed to sync clearAllRead to server:', e);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
    try {
      await agencyNotificationsService.deleteNotification(id);
    } catch (e) {
      console.error('Failed to sync deleteNotification to server:', e);
    }
  };

  const archiveNotification = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'ARCHIVED' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
    try {
      await agencyNotificationsService.archiveNotification(id);
    } catch (e) {
      console.error('Failed to sync archiveNotification to server:', e);
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
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
    refreshNotifications,
  };
}
