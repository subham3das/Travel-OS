import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Bell, Car, CheckCheck, Trash, Search, X } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { NotificationGroup } from '../../components/notifications/NotificationGroup';
import { NotificationBottomSheet } from '../../components/notifications/NotificationBottomSheet';
import { NotificationFilters } from '../../components/notifications/NotificationFilters';
import { NotificationSkeleton } from '../../components/notifications/NotificationSkeleton';
import { EmptyNotificationState } from '../../components/notifications/EmptyNotificationState';
import { ErrorNotificationState } from '../../components/notifications/ErrorNotificationState';
import { NotificationSearch } from '../../components/notifications/NotificationSearch';

import {
  useCarRentalNotifications,
  CarRentalNotificationTab,
} from '../../hooks/useCarRentalNotifications';
import { CarRentalNotification } from '../../services/carRentalNotifications.service';

// Car Rental specific tabs
const CAR_RENTAL_TABS: CarRentalNotificationTab[] = [
  'All',
  'Unread',
  'Bookings',
  'Payments',
  'Fleet',
  'Drivers',
  'Reviews',
  'Admin',
];

/**
 * Car Rental Notifications Page
 * Route: /agency/car-rental/notifications
 *
 * Independent from Agency Notifications — only shows car-rental scoped events:
 * New Booking | Payment | Fleet/Vehicle | Driver | Review | Admin announcements
 */
export const AgencyCarRentalNotificationsPage: React.FC = () => {
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
  } = useCarRentalNotifications();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleClearAllFilters = () => {
    setFilters({ category: 'ALL', readStatus: 'ALL', sortBy: 'newest' });
    setSearchTerm('');
    setActiveTab('All');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">

          {/* ── Header ── */}
          <div className="space-y-3 select-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                      Car Rental Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-xs font-black shadow-2xs">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400">
                    Vehicle bookings, fleet updates, driver alerts & more
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-2xl border border-slate-200 bg-white hover:bg-sky-50 hover:text-sky-600 text-slate-600 transition-colors shadow-2xs cursor-pointer"
                  title="Search notifications"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-3 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4 text-sky-500" />
                  <span>Mark All Read</span>
                </button>

                <button
                  type="button"
                  onClick={clearAllRead}
                  className="px-3 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Clear all read"
                >
                  <Trash className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Clear Read</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Search ── */}
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

          {/* ── Car Rental Tabs ── */}
          <div className="flex items-center justify-between gap-2.5 select-none w-full">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
              {CAR_RENTAL_TABS.map((tab) => {
                const isSelected = activeTab === tab;
                const count = tabCounts[tab];
                const isUnreadTab = tab === 'Unread';

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-500 shadow-xs scale-[1.02]'
                        : 'bg-white text-slate-600 border-slate-200/80 hover:border-sky-200 hover:text-sky-600'
                    }`}
                  >
                    <span>{tab}</span>
                    {count !== undefined && count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isUnreadTab
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2 rounded-full bg-white border border-slate-200/80 hover:border-sky-500 text-slate-600 hover:text-sky-600 transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Filter Notifications"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* ── Notification List ── */}
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
                      items={group.items as any}
                      onSelect={(n) => {
                        setSelectedNotification(n as unknown as CarRentalNotification);
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

      {/* Notification Detail Sheet */}
      <NotificationBottomSheet
        notification={selectedNotification as any}
        onClose={() => setSelectedNotification(null)}
        onMarkAsRead={markAsRead}
      />

      {/* Filters Modal */}
      <NotificationFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={(f) => setFilters(f)}
        onClear={handleClearAllFilters}
      />

      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalNotificationsPage;
