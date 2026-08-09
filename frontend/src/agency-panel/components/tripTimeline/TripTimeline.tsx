import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import {
  TimelineDay,
  DayLiveStatus,
  TripLiveStatus,
  TripIncident,
  TripNote,
  TripPhoto,
  LiveStats,
  MOCK_TIMELINE_DAYS,
  MOCK_INCIDENTS,
  MOCK_TRIP_NOTES,
  MOCK_TRIP_PHOTOS,
} from '../../data/tripTimeline';

import { LiveStatsCard } from './LiveStatsCard';
import { TimelineDayCard } from './TimelineDayCard';
import { IncidentCard } from './IncidentCard';
import { TripNoteCard } from './TripNoteCard';
import { PhotoTimeline } from './PhotoTimeline';
import { TripChatPlaceholder } from './TripChatPlaceholder';
import { CompleteTripModal } from './CompleteTripModal';

interface TripTimelineProps {
  tripId: string;
  packageName: string;
  travelerCount: number;
  currentTripStatus: TripLiveStatus;
  onTripStatusChange?: (newStatus: TripLiveStatus) => void;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  tripId,
  packageName,
  travelerCount,
  currentTripStatus = 'Ongoing',
  onTripStatusChange,
}) => {
  const [tripStatus, setTripStatus] = useState<TripLiveStatus>(currentTripStatus);
  const [days, setDays] = useState<TimelineDay[]>(MOCK_TIMELINE_DAYS);
  const [incidents, setIncidents] = useState<TripIncident[]>(MOCK_INCIDENTS);
  const [notes, setNotes] = useState<TripNote[]>(MOCK_TRIP_NOTES);
  const [photos, setPhotos] = useState<TripPhoto[]>(MOCK_TRIP_PHOTOS);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Calculate Live Stats ────────────────────────────────────────────────────
  const currentDayNumber = days.find((d) => d.status === 'In Progress')?.dayNumber || 2;
  const completedDaysCount = days.filter((d) => d.status === 'Completed').length;
  const remainingDaysCount = days.length - completedDaysCount;
  const openIncidentsCount = incidents.filter((i) => !i.isResolved).length;

  const liveStats: LiveStats = {
    currentDay: currentDayNumber,
    totalDays: days.length,
    completedDays: completedDaysCount,
    remainingDays: remainingDaysCount,
    presentTravelersCount: travelerCount,
    totalTravelersCount: travelerCount,
    delayedActivitiesCount: days.flatMap((d) => d.activities).filter((a) => a.status === 'Delayed').length,
    openIncidentsCount,
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Start Trip (Upcoming -> Ongoing)
  const handleStartTrip = () => {
    setTripStatus('Ongoing');
    if (onTripStatusChange) onTripStatusChange('Ongoing');
    showToast('🚀 Trip officially started! Status updated to ONGOING.');
  };

  // Complete Day Status Update
  const handleUpdateDayStatus = (dayNumber: number, newStatus: DayLiveStatus) => {
    setDays((prev) =>
      prev.map((d) => (d.dayNumber === dayNumber ? { ...d, status: newStatus } : d))
    );
    showToast(`Day ${dayNumber} status updated to "${newStatus}"`);
  };

  // Toggle Daily Checklist Item
  const handleToggleChecklistItem = (dayNumber: number, itemId: string) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        return {
          ...d,
          checklist: d.checklist.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        };
      })
    );
  };

  // Update Activity Status
  const handleUpdateActivityStatus = (dayNumber: number, activityId: string, newStatus: DayLiveStatus) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        return {
          ...d,
          activities: d.activities.map((act) =>
            act.id === activityId ? { ...act, status: newStatus } : act
          ),
        };
      })
    );
  };

  // Add Incident
  const handleAddIncident = (newInc: Omit<TripIncident, 'id'>) => {
    const incObj: TripIncident = {
      ...newInc,
      id: `inc-${Date.now()}`,
    };
    setIncidents((prev) => [incObj, ...prev]);
    showToast(`⚠️ New incident recorded: ${newInc.category}`);
  };

  // Toggle Incident Resolved
  const handleToggleResolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, isResolved: !i.isResolved } : i))
    );
    showToast('Incident status updated');
  };

  // Add Note
  const handleAddNote = (newNote: Omit<TripNote, 'id'>) => {
    const noteObj: TripNote = {
      ...newNote,
      id: `note-${Date.now()}`,
    };
    setNotes((prev) => [noteObj, ...prev]);
    showToast('Operational note posted');
  };

  // Add Photo
  const handleAddPhoto = (newPhoto: Omit<TripPhoto, 'id'>) => {
    const photoObj: TripPhoto = {
      ...newPhoto,
      id: `ph-${Date.now()}`,
    };
    setPhotos((prev) => [photoObj, ...prev]);
    showToast('📷 Photo added to timeline gallery');
  };

  // Confirm Complete Trip
  const handleConfirmCompleteTrip = () => {
    setIsCompleteModalOpen(false);
    setTripStatus('Completed');
    if (onTripStatusChange) onTripStatusChange('Completed');

    // Mark all days as completed
    setDays((prev) => prev.map((d) => ({ ...d, status: 'Completed' as const })));

    showToast('🎉 Trip completed! Review & Rating requests sent to all 18 travelers.');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#0F172A] text-white text-xs font-black shadow-xl flex items-center justify-between gap-3 border border-slate-700"
          >
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Trip CTA Banner if status is Upcoming */}
      {tripStatus === 'Upcoming' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#583BE8] to-purple-600 text-white shadow-lg shadow-[#583BE8]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-black">Departure Date Arrived — Ready to Start?</h3>
            </div>
            <p className="text-xs text-purple-100 font-medium">
              Start the live trip operation to begin daily tracking, activity updates, and incident logging.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartTrip}
            className="px-6 py-3 rounded-2xl bg-white text-[#583BE8] font-black text-xs sm:text-sm hover:bg-purple-50 shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-[#583BE8]" />
            <span>Start Trip Operation</span>
          </button>
        </div>
      )}

      {/* 1. Live Operations Dashboard Stats Card */}
      <LiveStatsCard stats={liveStats} />

      {/* 2. Vertical Itinerary Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#583BE8]" />
            <h3 className="text-base font-black text-[#0F172A]">Day-by-Day Operations Timeline</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">{days.length} Days Itinerary</span>
        </div>

        <div className="space-y-6 pt-2">
          {days.map((day) => (
            <TimelineDayCard
              key={day.dayNumber}
              day={day}
              isCurrentDay={day.dayNumber === currentDayNumber}
              onUpdateDayStatus={handleUpdateDayStatus}
              onToggleChecklistItem={handleToggleChecklistItem}
              onUpdateActivityStatus={handleUpdateActivityStatus}
            />
          ))}
        </div>
      </div>

      {/* 3. Incident Log */}
      <IncidentCard
        incidents={incidents}
        onAddIncident={handleAddIncident}
        onToggleResolve={handleToggleResolveIncident}
      />

      {/* 4. Host Notes */}
      <TripNoteCard
        notes={notes}
        onAddNote={handleAddNote}
      />

      {/* 5. Photo Timeline Gallery */}
      <PhotoTimeline
        photos={photos}
        onAddPhoto={handleAddPhoto}
      />

      {/* 6. Trip Communication Chat Placeholder */}
      <TripChatPlaceholder />

      {/* 7. End Trip Section / CTA */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100/90 shadow-2xs space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-black text-[#0F172A]">Conclude Trip Operations</h3>
          <p className="text-xs font-semibold text-slate-400">
            When all itinerary days and final drop-offs are completed, conclude the trip to trigger review requests to travelers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCompleteModalOpen(true)}
          disabled={tripStatus === 'Completed'}
          className={`px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-2 ${
            tripStatus === 'Completed'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{tripStatus === 'Completed' ? 'Trip Operation Completed ✓' : 'Complete Trip & Request Reviews'}</span>
        </button>
      </div>

      {/* Complete Trip Confirmation Modal */}
      <CompleteTripModal
        isOpen={isCompleteModalOpen}
        packageName={packageName}
        travelerCount={travelerCount}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirmComplete={handleConfirmCompleteTrip}
      />
    </div>
  );
};

export default TripTimeline;
