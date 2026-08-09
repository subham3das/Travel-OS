import { useState, useMemo } from 'react';
import {
  MOCK_AGENCY_NOTIFICATIONS,
  AgencyNotification,
  NotificationCategory,
} from '../data/notifications';

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
  const [notifications, setNotifications] = useState<AgencyNotification[]>(
    MOCK_AGENCY_NOTIFICATIONS
  );
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

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
        groups.push({ dateGroup: item.dateGroup, items: [item] });
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  // Actions
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false, status: 'READ' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: false, status: 'READ' } : null));
    }
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: true, status: 'UNREAD' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, isUnread: true, status: 'UNREAD' } : null));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false, status: 'READ' }))
    );
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((n) => n.isUnread));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'ARCHIVED' } : n))
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
  };

  const refreshNotifications = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
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
