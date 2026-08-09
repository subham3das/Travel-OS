import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, Users, ShieldCheck, Clock } from 'lucide-react';

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { TripHeroCard } from '../../components/tripDetails/TripHeroCard';
import { TripProgress } from '../../components/tripDetails/TripProgress';
import { OverviewGrid } from '../../components/tripDetails/OverviewGrid';
import { TravelerList } from '../../components/tripDetails/TravelerList';
import { ItineraryCard } from '../../components/tripDetails/ItineraryCard';
import { AnnouncementsCard } from '../../components/tripDetails/AnnouncementsCard';
import { TimelineCard } from '../../components/tripDetails/TimelineCard';
import { InternalNotesCard } from '../../components/tripDetails/InternalNotesCard';
import { StickyActionBar } from '../../components/tripDetails/StickyActionBar';

// Trip Operations Components
import { TripOperationsSummaryCard } from '../../components/tripDetails/TripOperationsSummaryCard';
import { OperationalChecklistCard } from '../../components/tripDetails/OperationalChecklistCard';
import { TeamAssignmentCard } from '../../components/tripDetails/TeamAssignmentCard';
import { VehicleAssignmentCard } from '../../components/tripDetails/VehicleAssignmentCard';
import { HotelInformationCard } from '../../components/tripDetails/HotelInformationCard';
import { EmergencyInformationCard } from '../../components/tripDetails/EmergencyInformationCard';

// Trip Timeline & Live Operations Module
import { TripTimeline } from '../../components/tripTimeline/TripTimeline';

import {
  MOCK_TRIP_DETAILS,
  MOCK_TRAVELERS,
  MOCK_ITINERARY,
  MOCK_ANNOUNCEMENTS,
  MOCK_TRIP_TIMELINE,
  MOCK_INTERNAL_NOTES,
  AssignedTeamMember,
  AssignedVehicle,
  HotelInfo,
  EmergencyInfo,
  TripOperationsData,
  OperationsChecklistItem,
} from '../../data/tripDetails';
import { TripLiveStatus } from '../../data/tripTimeline';

type DetailTab = 'overview' | 'travelers' | 'operations' | 'timeline';

const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',   label: 'Overview',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'travelers',  label: 'Travelers',  icon: <Users           className="w-4 h-4" /> },
  { id: 'operations', label: 'Operations', icon: <ShieldCheck     className="w-4 h-4" /> },
  { id: 'timeline',   label: 'Timeline',   icon: <Clock           className="w-4 h-4" /> },
];

// ── Mock team returned from Team Management after assignment ──────────────────
const MOCK_ASSIGNED_TEAM: AssignedTeamMember[] = [
  {
    id: 'at-1',
    name: 'John Smith',
    role: 'Trip Manager',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    id: 'at-2',
    name: 'Rahul Das',
    role: 'Trip Host',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
  },
  {
    id: 'at-3',
    name: 'Aman Sharma',
    role: 'Guide',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
  {
    id: 'at-4',
    name: 'Rakesh Kumar',
    role: 'Driver',
    phone: '+91 65432 10987',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
  },
];

// ── Mock vehicles returned from Vehicle Management after assignment ─────────
const MOCK_ASSIGNED_VEHICLES: AssignedVehicle[] = [
  {
    id: 'v-1',
    name: 'Tempo Traveller Deluxe',
    registrationNumber: 'UK 07 PA 1234',
    type: '17+1 Seater AC Bus',
    capacity: 18,
    assignedDriver: 'Rakesh Kumar',
    status: 'Assigned',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
  },
];

/**
 * Agency Trip Operations Center & Details Page
 * Route: /agency/trips/:tripId (Protected: APPROVED agencies only)
 *
 * Tabs:
 * 1. Overview — High level summary & progress
 * 2. Travelers — Traveler list & management shortcut
 * 3. Operations — Checklist, Team, Vehicle, Hotel & Emergency info
 * 4. Timeline — Live day-by-day operations, incidents, notes, photo log
 */
export const AgencyTripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTripId = tripId || MOCK_TRIP_DETAILS.tripId;
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  // ── Operations State ───────────────────────────────────────────────────────
  const [teamAssignments, setTeamAssignments] = useState<AssignedTeamMember[] | null>(MOCK_ASSIGNED_TEAM);
  const [vehicleAssignments, setVehicleAssignments] = useState<AssignedVehicle[] | null>(MOCK_ASSIGNED_VEHICLES);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>({
    hotelName: 'The Grand Himalayan Resort',
    address: 'Leh, Ladakh 194101',
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    roomAllocationNotes: '8 double rooms reserved for guests.',
  });
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo | null>({
    contactPerson: 'Ramesh Kumar (Operations Desk)',
    contactPhone: '+91 98765 00000',
    nearestHospital: 'SNM Hospital, Leh',
    nearestPoliceStation: 'Leh Police Station',
    backupVehicleContact: '+91 87654 32109',
    additionalNotes: 'Oxygen cylinders kept in vehicle UK 07 PA 1234.',
  });

  const [liveTripStatus, setLiveTripStatus] = useState<TripLiveStatus>('Ongoing');

  // ── Read query params on return from Team / Vehicle Management ──────────────
  useEffect(() => {
    if (searchParams.get('teamAssigned') === 'true') {
      setTeamAssignments(MOCK_ASSIGNED_TEAM);
      setActiveTab('operations');
      setSearchParams({}, { replace: true });
    }
    if (searchParams.get('vehicleAssigned') === 'true') {
      setVehicleAssignments(MOCK_ASSIGNED_VEHICLES);
      setActiveTab('operations');
      setSearchParams({}, { replace: true });
    }
    if (searchParams.get('tab')) {
      const tabParam = searchParams.get('tab') as DetailTab;
      if (['overview', 'travelers', 'operations', 'timeline'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  // ── Derive 4-item checklist from real data ─────────────────────────────────
  const operationsChecklist: OperationsChecklistItem[] = useMemo(() => [
    { id: 'team', label: 'Team Assigned', isCompleted: Boolean(teamAssignments) },
    { id: 'vehicle', label: 'Vehicle Assigned', isCompleted: Boolean(vehicleAssignments) },
    { id: 'hotel', label: 'Hotel Information Added', isCompleted: Boolean(hotelInfo) },
    { id: 'emergency', label: 'Emergency Information Added', isCompleted: Boolean(emergencyInfo) },
  ], [teamAssignments, vehicleAssignments, hotelInfo, emergencyInfo]);

  const completedCount = operationsChecklist.filter((c) => c.isCompleted).length;
  const completionPercentage = Math.round((completedCount / 4) * 100);
  const isSetupComplete = completedCount === 4;

  const tripOperations: TripOperationsData = {
    teamAssignments,
    vehicleAssignments,
    hotelInformation: hotelInfo,
    emergencyInformation: emergencyInfo,
    operationsChecklist,
    completionPercentage,
    status: isSetupComplete ? 'Upcoming' : 'Pending Setup',
  };

  // ── Trip object for hero card ──────────────────────────────────────────────
  const trip = {
    ...MOCK_TRIP_DETAILS,
    tripId: currentTripId,
    statusCategory: liveTripStatus as any,
    statusText: liveTripStatus === 'Ongoing' ? 'ONGOING TRIP' : liveTripStatus === 'Completed' ? 'Completed' : 'Ready to Start',
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNavigateToTeam = () => {
    navigate(`/agency/trips/${currentTripId}/team`);
  };

  const handleNavigateToVehicle = () => {
    navigate(`/agency/trips/${currentTripId}/vehicle`);
  };

  const handleSaveHotel = (info: HotelInfo) => {
    setHotelInfo(info);
  };

  const handleSaveEmergency = (info: EmergencyInfo) => {
    setEmergencyInfo(info);
  };

  const handleStartTrip = () => {
    setLiveTripStatus('Ongoing');
    setActiveTab('timeline');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Sticky Sub-Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-14 z-20">
          <button
            type="button"
            onClick={() => navigate('/agency/trips')}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Trips</span>
          </button>

          <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Trip Operations Center</h2>

          <div className="w-16 sm:w-24" />
        </div>

        {/* ── 4-Tab Navigation Bar ── */}
        <div className="sticky top-[7.5rem] z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex">
            {DETAIL_TABS.map((tab) => {
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

                  {/* Sliding underline indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="trip-detail-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#583BE8] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">

          {/* 1. Trip Hero Card (shared on top) */}
          <TripHeroCard
            trip={trip}
            isSetupComplete={isSetupComplete}
            onEditTrip={() => alert(`Edit Trip ${currentTripId} — coming soon!`)}
            onAnnouncements={() => alert('Create Broadcast — coming soon!')}
            onStartTrip={handleStartTrip}
          />

          <AnimatePresence mode="wait">
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 1: OVERVIEW
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <TripProgress />
                <OverviewGrid trip={trip} />

                {/* 2-Column: Today's Itinerary & Announcements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ItineraryCard itinerary={MOCK_ITINERARY} dayBadgeText="Day 1 • 15 May" />
                  <AnnouncementsCard
                    announcements={MOCK_ANNOUNCEMENTS}
                    onViewAll={() => alert('View All Announcements — coming soon')}
                  />
                </div>

                {/* 2-Column: Audit Log & Internal Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimelineCard
                    events={MOCK_TRIP_TIMELINE}
                    onViewAll={() => setActiveTab('timeline')}
                  />
                  <InternalNotesCard
                    notes={MOCK_INTERNAL_NOTES}
                    onViewAll={() => setActiveTab('timeline')}
                  />
                </div>
              </motion.div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 2: TRAVELERS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'travelers' && (
              <motion.div
                key="travelers"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <TravelerList
                  travelers={MOCK_TRAVELERS}
                  totalCount={trip.travelerCount}
                  onViewAll={() => navigate(`/agency/trips/${currentTripId}/travelers`)}
                  onSelectTraveler={(id) => navigate(`/agency/trips/${currentTripId}/travelers/${id}`)}
                />
              </motion.div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 3: OPERATIONS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'operations' && (
              <motion.div
                key="operations"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <TripOperationsSummaryCard
                  operations={tripOperations}
                  travelerCount={trip.travelerCount}
                />
                <OperationalChecklistCard checklist={operationsChecklist} />
                <TeamAssignmentCard
                  tripId={currentTripId}
                  assignedTeam={teamAssignments}
                  onNavigateToTeam={handleNavigateToTeam}
                />
                <VehicleAssignmentCard
                  tripId={currentTripId}
                  vehicleAssignments={vehicleAssignments}
                  bookedTravelersCount={trip.travelerCount}
                  onNavigateToVehicle={handleNavigateToVehicle}
                />
                <HotelInformationCard
                  hotelInfo={hotelInfo}
                  onSave={handleSaveHotel}
                />
                <EmergencyInformationCard
                  emergencyInfo={emergencyInfo}
                  onSave={handleSaveEmergency}
                />
              </motion.div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TAB 4: TIMELINE & LIVE OPERATIONS (NEW)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <TripTimeline
                  tripId={currentTripId}
                  packageName={trip.packageName}
                  travelerCount={trip.travelerCount}
                  currentTripStatus={liveTripStatus}
                  onTripStatusChange={(newStatus) => setLiveTripStatus(newStatus)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Sticky Bottom Action Bar */}
      <StickyActionBar
        statusCategory={liveTripStatus as any}
        isSetupComplete={isSetupComplete}
        onCheckInTravelers={() => navigate(`/agency/trips/${currentTripId}/travelers`)}
        onPrimaryAction={handleStartTrip}
      />

      <BottomNavigation />
    </div>
  );
};

export default AgencyTripDetailPage;
