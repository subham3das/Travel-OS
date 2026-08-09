import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationsHeader } from '../../components/notifications/NotificationsHeader';
import { NotificationTabs } from '../../components/notifications/NotificationTabs';
import { NotificationGroup } from '../../components/notifications/NotificationGroup';
import { NotificationSearch } from '../../components/notifications/NotificationSearch';
import { NotificationBottomSheet } from '../../components/notifications/NotificationBottomSheet';
import { NotificationFilters } from '../../components/notifications/NotificationFilters';
import { NotificationSkeleton } from '../../components/notifications/NotificationSkeleton';
import { EmptyNotificationState } from '../../components/notifications/EmptyNotificationState';
import { ErrorNotificationState } from '../../components/notifications/ErrorNotificationState';

/**
 * Agency Notifications Page
 * Route: /agency/notifications (Protected: APPROVED agencies only)
 * Centralized activity inbox for all agency events.
 */
export const AgencyNotificationsPage: React.FC = () => {
  const {
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
  } = useNotifications();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleClearAllFilters = () => {
    setFilters({ category: 'ALL', readStatus: 'ALL', sortBy: 'newest' });
    setSearchTerm('');
    setActiveTab('All');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* 1. Header */}
          <NotificationsHeader
            unreadCount={unreadCount}
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            onMarkAllRead={markAllAsRead}
            onClearAllRead={clearAllRead}
          />

          {/* 2. Expandable Live Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <NotificationSearch
                  value={searchTerm}
                  onChange={(val) => setSearchTerm(val)}
                  onClear={() => setSearchTerm('')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Horizontal Scrollable Filter Chips */}
          <NotificationTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            tabCounts={tabCounts}
            onOpenFilters={() => setIsFilterModalOpen(true)}
          />

          {/* 4. Notification List grouped by Date */}
          <div className="space-y-6 min-h-[400px]">
            {isLoading ? (
              <NotificationSkeleton />
            ) : isError ? (
              <ErrorNotificationState onRetry={refreshNotifications} />
            ) : groupedNotifications.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${filters.category}-${filters.readStatus}-${filters.sortBy}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {groupedNotifications.map((group) => (
                    <NotificationGroup
                      key={group.dateGroup}
                      dateGroup={group.dateGroup}
                      items={group.items}
                      onSelect={(n) => {
                        setSelectedNotification(n);
                        markAsRead(n.id);
                      }}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                      onDelete={deleteNotification}
                      onArchive={archiveNotification}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <EmptyNotificationState onResetSearch={handleClearAllFilters} />
            )}
          </div>
        </main>
      </div>

      {/* 5. Notification Details Bottom Sheet (Mobile) / Right Drawer (Desktop) */}
      <NotificationBottomSheet
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkAsRead={markAsRead}
      />

      {/* 6. Advanced Filters Modal */}
      <NotificationFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={(f) => setFilters(f)}
        onClear={handleClearAllFilters}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyNotificationsPage;
