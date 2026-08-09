import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { TripsHeader } from '../../components/trips/TripsHeader';
import { TripTabs } from '../../components/trips/TripTabs';
import { TripsSearchBar } from '../../components/trips/TripsSearchBar';
import { TripCard } from '../../components/trips/TripCard';
import { TripsStats } from '../../components/trips/TripsStats';
import {
  MOCK_AGENCY_TRIPS,
  MOCK_TRIPS_STATS,
  TripStatusCategory,
} from '../../data/trips';

/**
 * Agency Trip Operations Dashboard Page
 * Route: /agency/trips (Protected: APPROVED agencies only)
 */
export const AgencyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TripStatusCategory>('Pending Setup');
  const [searchTerm, setSearchTerm] = useState('');

  // Tab badge counts
  const tabCounts = useMemo(() => {
    return MOCK_AGENCY_TRIPS.reduce(
      (acc, trip) => {
        acc[trip.statusCategory] = (acc[trip.statusCategory] || 0) + 1;
        return acc;
      },
      { 'Pending Setup': 0, Upcoming: 0, Ongoing: 0, Completed: 0, Cancelled: 0 } as Record<TripStatusCategory, number>
    );
  }, []);

  // Filtered trips list based on active tab and search query
  const filteredTrips = useMemo(() => {
    return MOCK_AGENCY_TRIPS.filter((trip) => {
      const matchesTab = trip.statusCategory === activeTab;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        trip.packageName.toLowerCase().includes(query) ||
        trip.tripId.toLowerCase().includes(query) ||
        trip.destinationRoute.toLowerCase().includes(query) ||
        trip.guideName.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const handleSelectTrip = (tripId: string) => {
    navigate(`/agency/trips/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <TripsHeader />

          {/* Segmented Tabs */}
          <TripTabs activeTab={activeTab} onSelectTab={setActiveTab} counts={tabCounts} />

          {/* Search & Filter Bar */}
          <TripsSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={() => alert('Filter popup coming soon')}
            onDateClick={() => alert('Date filter coming soon')}
            onSortClick={() => alert('Sort options coming soon')}
          />

          {/* Trip Cards List */}
          <div className="space-y-3 min-h-[300px]">
            <AnimatePresence mode="wait">
              {filteredTrips.length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {filteredTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onClick={() => handleSelectTrip(trip.tripId)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center bg-white rounded-3xl border border-slate-100/90 shadow-2xs space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                      {activeTab === 'Pending Setup' && 'No pending trips'}
                      {activeTab === 'Upcoming' && 'No trips scheduled'}
                      {activeTab === 'Ongoing' && 'No active trips'}
                      {activeTab === 'Completed' && 'No completed trips yet'}
                      {activeTab === 'Cancelled' && 'No cancelled trips'}
                    </h4>
                    <p className="text-xs font-medium text-slate-400">
                      {activeTab === 'Pending Setup'
                        ? 'Trips moved from Bookings will appear here awaiting setup.'
                        : activeTab === 'Upcoming'
                        ? 'Trip batches will appear here once scheduled.'
                        : `There are currently no ${activeTab.toLowerCase()} trip batches.`}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Stats Bar */}
          <TripsStats stats={MOCK_TRIPS_STATS} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyTripsPage;
