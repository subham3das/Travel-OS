import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  DetailedTripInfo,
} from '../../data/tripDetails';
import { TripLiveStatus } from '../../data/tripTimeline';
import { agencyTripsService, TripDetailResponse } from '../../services/agencyTrips.service';

type DetailTab = 'overview' | 'travelers' | 'operations' | 'timeline';

const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',   label: 'Overview',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'travelers',  label: 'Travelers',  icon: <Users           className="w-4 h-4" /> },
  { id: 'operations', label: 'Operations', icon: <ShieldCheck     className="w-4 h-4" /> },
  { id: 'timeline',   label: 'Timeline',   icon: <Clock           className="w-4 h-4" /> },
];

/**
 * Agency Trip Operations Center & Details Page
 * Route: /agency/trips/:tripId (Protected: APPROVED agencies only)
 */
export const AgencyTripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTripId = tripId || 'LD-1505-2024';
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [tripData, setTripData] = useState<TripDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Operations State ───────────────────────────────────────────────────────
  const [teamAssignments, setTeamAssignments] = useState<AssignedTeamMember[] | null>(null);
  const [vehicleAssignments, setVehicleAssignments] = useState<AssignedVehicle[] | null>(null);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo | null>(null);
  const [liveTripStatus, setLiveTripStatus] = useState<TripLiveStatus>('Ongoing');

  const loadTripData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await agencyTripsService.getTripById(currentTripId);
      setTripData(data);
      setTeamAssignments(data.teamAssignments?.length ? data.teamAssignments : null);
      setVehicleAssignments(data.vehicleAssignments?.length ? data.vehicleAssignments : null);
      setHotelInfo(data.hotelInformation || null);
      setEmergencyInfo(data.emergencyInformation || null);
      setLiveTripStatus((data.statusCategory as TripLiveStatus) || 'Ongoing');
    } catch (error) {
      console.error('Failed to load trip details from backend:', error);
      // Fallback to initial mock if offline
      setTeamAssignments(MOCK_TRIP_DETAILS as any);
    } finally {
      setIsLoading(false);
    }
  }, [currentTripId]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  // ── Read query params on return from Team / Vehicle Management ──────────────
  useEffect(() => {
    if (searchParams.get('teamAssigned') === 'true') {
      setActiveTab('operations');
      setSearchParams({}, { replace: true });
      loadTripData();
    }
    if (searchParams.get('vehicleAssigned') === 'true') {
      setActiveTab('operations');
      setSearchParams({}, { replace: true });
      loadTripData();
    }
    if (searchParams.get('tab')) {
      const tabParam = searchParams.get('tab') as DetailTab;
      if (['overview', 'travelers', 'operations', 'timeline'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams, loadTripData, setSearchParams]);

  // ── Derive 4-item checklist from real data ─────────────────────────────────
  const operationsChecklist: OperationsChecklistItem[] = useMemo(() => [
    { id: 'team', label: 'Team Assigned', isCompleted: Boolean(teamAssignments && teamAssignments.length > 0) },
    { id: 'vehicle', label: 'Vehicle Assigned', isCompleted: Boolean(vehicleAssignments && vehicleAssignments.length > 0) },
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
  const trip: DetailedTripInfo = tripData
    ? {
        ...tripData,
        statusCategory: liveTripStatus as any,
        statusText: liveTripStatus === 'Ongoing' ? 'ONGOING TRIP' : liveTripStatus === 'Completed' ? 'Completed' : 'Ready to Start',
      }
    : {
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

  const handleSaveHotel = async (info: HotelInfo) => {
    setHotelInfo(info);
    try {
      await agencyTripsService.updateTripHotel(currentTripId, info);
    } catch (err) {
      console.error('Failed to update hotel info in backend:', err);
    }
  };

  const handleSaveEmergency = async (info: EmergencyInfo) => {
    setEmergencyInfo(info);
    try {
      await agencyTripsService.updateTripEmergency(currentTripId, info);
    } catch (err) {
      console.error('Failed to update emergency info in backend:', err);
    }
  };

  const handleStartTrip = async () => {
    setLiveTripStatus('Ongoing');
    setActiveTab('timeline');
    try {
      await agencyTripsService.updateTripStatus(currentTripId, 'Ongoing');
    } catch (err) {
      console.error('Failed to start trip in backend:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Sticky Sub-Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
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
        <div className="sticky top-[107px] sm:top-[115px] z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 select-none">
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
                    announcements={(tripData?.announcements?.length ? tripData.announcements : MOCK_ANNOUNCEMENTS) as any}
                    onViewAll={() => setActiveTab('timeline')}
                  />
                </div>

                {/* 2-Column: Audit Log & Internal Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimelineCard
                    events={MOCK_TRIP_TIMELINE}
                    onViewAll={() => setActiveTab('timeline')}
                  />
                  <InternalNotesCard
                    notes={(tripData?.notes?.length ? tripData.notes : MOCK_INTERNAL_NOTES) as any}
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
                TAB 4: TIMELINE & LIVE OPERATIONS
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
