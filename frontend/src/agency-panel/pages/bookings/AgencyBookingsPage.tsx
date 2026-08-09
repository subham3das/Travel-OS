import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useBookings } from '../../hooks/useBookings';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { BookingSummaryCards } from '../../components/bookings/BookingSummaryCards';
import { BookingFilterBar } from '../../components/bookings/BookingFilterBar';
import { BookingGroupCard } from '../../components/bookings/BookingGroupCard';
import { BookingDetailsSheet } from '../../components/bookings/BookingDetailsSheet';
import { BookingFiltersModal } from '../../components/bookings/BookingFiltersModal';
import { MoveToTripsModal } from '../../components/bookings/MoveToTripsModal';
import { EmptyBookingsState } from '../../components/bookings/EmptyBookingsState';
import { LoadingBookingSkeleton } from '../../components/bookings/LoadingBookingSkeleton';

/**
 * Agency Bookings Page
 * Route: /agency/bookings (Protected: APPROVED agencies only)
 * Manages all traveler reservations & departure groups before operational trip assignment.
 */
export const AgencyBookingsPage: React.FC = () => {
  const {
    groups,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    selectedBooking,
    setSelectedBooking,
    selectedMoveGroup,
    setSelectedMoveGroup,
    isFilterModalOpen,
    setIsFilterModalOpen,
    filterStatus,
    setFilterStatus,
    filterPayment,
    setFilterPayment,
    isLoading,
    summary,
    confirmBooking,
    rejectBooking,
    extendDeadline,
    cancelDeparture,
    forceCreateTrip,
    moveGroupToTrips,
  } = useBookings();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleApplyFilters = (status: string, payment: string) => {
    setFilterStatus(status);
    setFilterPayment(payment);
  };

  const handleClearFilters = () => {
    setFilterStatus('All');
    setFilterPayment('All');
    setSearchTerm('');
    setActiveTab('All');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* 1. Header */}
          <BookingsHeader
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />

          {/* 2. Search Input (Expandable) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by package, booking group, trip ID, departure or traveler..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] shadow-2xs"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Summary Cards */}
          <BookingSummaryCards summary={summary} />

          {/* 4. Filter Bar (Chips + Sort Dropdown + Trip Ready & Min Not Reached chips) */}
          <BookingFilterBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            sortOption={sortOption}
            onSelectSort={setSortOption}
            tripReadyCount={summary.tripReady}
            minNotReachedCount={summary.minNotReached}
          />

          {/* 5. Departure Booking Groups List */}
          <div className="space-y-4 min-h-[350px]">
            {isLoading ? (
              <LoadingBookingSkeleton />
            ) : groups.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${sortOption}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {groups.map((group) => (
                    <BookingGroupCard
                      key={group.groupId}
                      group={group}
                      onSelectBooking={(b) => setSelectedBooking(b)}
                      onConfirmBooking={(id) => confirmBooking(id)}
                      onRejectBooking={(id) => rejectBooking(id)}
                      onCreateTrip={(grp) => setSelectedMoveGroup(grp)}
                      onExtendDeadline={(grp, newDate) => extendDeadline(grp, newDate)}
                      onCancelDeparture={(grp) => cancelDeparture(grp)}
                      onForceCreateTrip={(grp) => forceCreateTrip(grp)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <EmptyBookingsState onResetSearch={handleClearFilters} />
            )}
          </div>
        </main>
      </div>

      {/* 6. Booking Details Sheet (Bottom Sheet / Drawer) */}
      <BookingDetailsSheet
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onConfirm={(id) => confirmBooking(id)}
        onReject={(id) => rejectBooking(id)}
      />

      {/* 7. Create Trip Confirmation Modal */}
      <MoveToTripsModal
        group={selectedMoveGroup}
        isOpen={Boolean(selectedMoveGroup)}
        onClose={() => setSelectedMoveGroup(null)}
        onConfirmMove={(grp) => moveGroupToTrips(grp)}
      />

      {/* 8. Booking Filters Modal */}
      <BookingFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterStatus={filterStatus}
        filterPayment={filterPayment}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyBookingsPage;
