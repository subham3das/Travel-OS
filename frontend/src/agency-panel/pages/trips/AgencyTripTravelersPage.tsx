import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Megaphone, MapPin } from 'lucide-react';

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { TripSummaryCard } from '../../components/team/TripSummaryCard';
import { TravelersHeader } from '../../components/travelers/TravelersHeader';
import { QuickStats } from '../../components/travelers/QuickStats';
import { TravelerSearch } from '../../components/travelers/TravelerSearch';
import { FilterChips, FilterChipValue } from '../../components/travelers/FilterChips';

// New individual-first components
import { TravelerCard } from '../../components/travelers/TravelerCard';

import { QuickContactsCard } from '../../components/travelers/QuickContactsCard';
import { StickyCheckInBar } from '../../components/travelers/StickyCheckInBar';
import { BookingDetailsSheet } from '../../components/bookings/BookingDetailsSheet';
import { AnnouncementSection } from '../../components/announcements/AnnouncementSection';

import {
  MOCK_TRIP_TRAVEL_GROUPS,
  MOCK_QUICK_CONTACTS,
  TripTravelGroup,
  TripTravelerRecord,
} from '../../data/travelers';
import { MOCK_AGENCY_BOOKINGS, AgencyBooking } from '../../data/bookings';
import { MOCK_TRIP_DETAILS } from '../../data/tripDetails';
import { MOCK_ANNOUNCEMENTS_SEED } from '../../data/announcements';

type ActiveTab = 'management' | 'announcements';

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'management', label: 'Management', icon: <Users className="w-4 h-4" /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
];

/**
 * Agency Trip Travelers Management Page
 * Route: /agency/trips/:tripId/travelers (Protected: APPROVED agencies only)
 *
 * Displays every booking as an individual traveler card (primary traveler visible).
 * Group bookings show a collapsible companion list — NO "Group 1 / Group 2" framing.
 *
 * Search matches: Traveler Name, Companion Name, Booking ID, Phone Number
 * Filters: All, Solo Travelers, Group Travelers, Present, Absent, Medical
 */
export const AgencyTripTravelersPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const currentTripId = tripId || 'LD-1505-2024';

  const [activeTab, setActiveTab] = useState<ActiveTab>('management');
  const [groups, setGroups] = useState<TripTravelGroup[]>(MOCK_TRIP_TRAVEL_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChipValue>('all');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<AgencyBooking | null>(null);

  // Flatten all travelers (primary + companions) for stats
  const allTravelersList = useMemo<TripTravelerRecord[]>(() => {
    const list: TripTravelerRecord[] = [];
    groups.forEach((g) => {
      list.push(g.primaryTraveler);
      if (g.companions) list.push(...g.companions);
    });
    return list;
  }, [groups]);

  // Quick Stats
  const stats = useMemo(() => {
    const total = allTravelersList.length;
    const checkedIn = allTravelersList.filter((t) => t.checkInStatus === 'Checked In').length;
    const pendingCheckIn = allTravelersList.filter((t) => t.checkInStatus === 'Not Checked In').length;
    const paymentPending = allTravelersList.filter((t) => t.paymentStatus === 'Payment Pending').length;
    return { total, checkedIn, pendingCheckIn, paymentPending };
  }, [allTravelersList]);

  // Search: match primary name, companion names, booking ID, phone
  // Filter: solo / group / attendance / medical
  const filteredGroups = useMemo<TripTravelGroup[]>(() => {
    return groups.filter((g) => {
      const q = searchTerm.toLowerCase().trim();

      if (q) {
        const primaryMatch =
          g.primaryTraveler.name.toLowerCase().includes(q) ||
          g.primaryTraveler.phone.includes(q);
        const bookingMatch = g.bookingId.toLowerCase().includes(q);
        const companionMatch = g.companions.some(
          (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
        );
        if (!primaryMatch && !bookingMatch && !companionMatch) return false;
      }

      const all = [g.primaryTraveler, ...g.companions];

      switch (activeFilter) {
        case 'solo':
          return g.totalTravelersCount === 1;
        case 'groups':
          return g.totalTravelersCount > 1;
        case 'checked-in':
          return all.some((t) => t.checkInStatus === 'Checked In');
        case 'not-checked-in':
          return all.some((t) => t.checkInStatus === 'Not Checked In');
        case 'medical':
          return all.some((t) => t.hasMedicalNotes);
        default:
          return true;
      }
    });
  }, [groups, searchTerm, activeFilter]);

  // Check-in handler — updates specific traveler anywhere in groups
  const handleCheckInTraveler = (travelerId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        const update = (t: TripTravelerRecord) =>
          t.id === travelerId ? { ...t, checkInStatus: 'Checked In' as const } : t;
        return {
          ...g,
          primaryTraveler: update(g.primaryTraveler),
          companions: g.companions.map(update),
        };
      })
    );
  };

  const handleCheckInAll = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        primaryTraveler: { ...g.primaryTraveler, checkInStatus: 'Checked In' },
        companions: g.companions.map((c) => ({ ...c, checkInStatus: 'Checked In' })),
      }))
    );
  };

  const handleOpenBookingDetails = (bookingId: string) => {
    const booking = MOCK_AGENCY_BOOKINGS.find((b) => b.id === bookingId) ?? MOCK_AGENCY_BOOKINGS[0];
    setSelectedBookingForModal(booking);
  };

  const handleExport = () => {
    alert(`Exporting traveler manifest for ${MOCK_TRIP_DETAILS.packageName} — coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Sticky Page Header */}
        <TravelersHeader
          tripId={currentTripId}
          totalCount={stats.total}
          onExport={handleExport}
        />

        {/* Tab Bar */}
        <div className="sticky top-[7.5rem] z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-xs font-extrabold transition-colors cursor-pointer ${
                    isActive ? 'text-[#583BE8]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator-travelers"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#583BE8] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-4xl mx-auto w-full">
          {/* Trip Summary card — shared across tabs */}
          <div className="mb-5">
            <TripSummaryCard
              tripId={currentTripId}
              packageName={MOCK_TRIP_DETAILS.packageName}
              coverImage={MOCK_TRIP_DETAILS.coverImage}
              dateRangeText={MOCK_TRIP_DETAILS.dateRangeText}
              destinationRoute={MOCK_TRIP_DETAILS.destinationRoute}
              travelerCount={MOCK_TRIP_DETAILS.travelerCount}
              capacity={MOCK_TRIP_DETAILS.capacity}
              statusText={MOCK_TRIP_DETAILS.statusText}
            />
          </div>

          <AnimatePresence mode="wait">

            {/* ─── MANAGEMENT TAB ──────────────────────────────────────────── */}
            {activeTab === 'management' && (
              <motion.div
                key="management"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Quick Stats */}
                <QuickStats
                  total={stats.total}
                  checkedIn={stats.checkedIn}
                  pendingCheckIn={stats.pendingCheckIn}
                  paymentPending={stats.paymentPending}
                />

                {/* Search + Filters */}
                <div className="space-y-3">
                  <TravelerSearch
                    value={searchTerm}
                    onChange={setSearchTerm}
                    filterCount={0}
                    onFilterClick={() => {}}
                  />
                  <FilterChips active={activeFilter} onChange={setActiveFilter} />
                </div>

                {/* Traveler Cards — individual-first, no group numbering */}
                <div className="space-y-3">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group, i) => (
                      <TravelerCard
                        key={group.groupId}
                        group={group}
                        index={i}
                        onCheckIn={handleCheckInTraveler}
                        onOpenBookingDetails={handleOpenBookingDetails}
                        onViewDetails={(id) =>
                          navigate(`/agency/trips/${currentTripId}/travelers/${id}`)
                        }
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-14 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-extrabold text-slate-400">No travelers found</p>
                      <p className="text-xs font-semibold text-slate-300">
                        Try adjusting your search or filters
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Quick Contacts */}
                <QuickContactsCard contacts={MOCK_QUICK_CONTACTS} />
              </motion.div>
            )}

            {/* ─── ANNOUNCEMENTS TAB ───────────────────────────────────────── */}
            {activeTab === 'announcements' && (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
              >
                <AnnouncementSection
                  tripId={currentTripId}
                  initialAnnouncements={MOCK_ANNOUNCEMENTS_SEED}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
        onConfirm={() => alert('Booking confirmed')}
        onReject={() => alert('Booking rejected')}
      />

      {/* Sticky Check-in Bar — management tab only */}
      {activeTab === 'management' && (
        <StickyCheckInBar onCheckInAll={handleCheckInAll} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default AgencyTripTravelersPage;
