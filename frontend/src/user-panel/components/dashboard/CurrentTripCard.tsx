import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Calendar,
  MapPin,
  MessageSquare,
  FileText,
  ShieldAlert,
  X,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useCurrentTrip } from '../../hooks/useCurrentTrip';

interface CurrentTripCardProps {
  className?: string;
  onExploreClick?: () => void;
  hideIfNoTrip?: boolean;
}

export const CurrentTripCard: React.FC<CurrentTripCardProps> = ({
  className = '',
  onExploreClick,
  hideIfNoTrip = false,
}) => {
  const navigate = useNavigate();
  const { trip, loading } = useCurrentTrip();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // ── When hideIfNoTrip is set (e.g. Home Page), do not render if loading or no ongoing trip ──
  if (hideIfNoTrip && (loading || !trip)) {
    return null;
  }

  // ── Loading Skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-xs dark:shadow-none space-y-4 animate-pulse ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-full" />
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700/60 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
            <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/40 rounded-full" />
        <div className="flex gap-2">
          <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-700/60 rounded-2xl" />
          <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────
  if (!trip) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100/90 dark:border-white/10 shadow-xs dark:shadow-none space-y-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-white">Current Trip</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 text-[10px] font-bold">
            No Ongoing Trip
          </span>
        </div>

        <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0 border border-indigo-100 dark:border-blue-900/40 shadow-xs">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white leading-snug">
                No ongoing trip
              </h4>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 mt-0.5">
                Ready for your next adventure?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExploreClick ?? (() => navigate('/explore'))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black transition-all cursor-pointer text-center shrink-0 flex items-center justify-center gap-2 shadow-md shadow-[#2563EB]/20 focus:outline-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Trips</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Active Trip Card ──────────────────────────────────────────────
  // Format dates for display (human-readable, no library needed)
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-xs dark:shadow-none space-y-4 ${className}`}
      >
        {/* ── Header: Title + "Trip Started" badge + Day counter ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-black text-[#0F172A] dark:text-white">Current Trip</h3>

          <div className="flex items-center gap-1.5">
            {/* Live "Trip Started" badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trip Started
            </span>

            {/* Day X of Y — backend-calculated, never hardcoded */}
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold">
              Day {trip.currentDay} of {trip.totalDays}
            </span>
          </div>
        </div>

        {/* ── Card Body: Cover Image + Package Details ── */}
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Cover Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-200/70 dark:border-white/10">
            {trip.coverImage ? (
              <>
                <img
                  src={trip.coverImage}
                  alt={trip.packageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-transparent dark:bg-black/25 pointer-events-none transition-colors" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]">
                <Compass className="w-7 h-7" />
              </div>
            )}
          </div>

          {/* Text Details */}
          <div className="min-w-0 flex-1 space-y-1.5">
            {/* Package Name */}
            <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white leading-tight truncate">
              {trip.packageName}
            </h4>

            {/* Destination */}
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{trip.destination}</span>
            </p>

            {/* Agency */}
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-extrabold text-slate-600 dark:text-slate-300">{trip.agencyName}</span>
            </p>

            {/* Date range */}
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span>
                {fmt(trip.startDate)} – {fmt(trip.endDate)}
              </span>
            </p>
          </div>
        </div>

        {/* ── Progress Bar — progressPercentage from backend, no client math ── */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
            <span>Trip Progress</span>
            <span className="text-[#2563EB] dark:text-[#60A5FA] font-black">{trip.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, trip.progressPercentage))}%` }}
            />
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center gap-2 flex-wrap">
          {/* Primary: View Trip */}
          <button
            type="button"
            onClick={() => navigate(trip.viewRoute)}
            className="flex-1 min-w-[130px] py-2.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shadow-[#2563EB]/20 focus:outline-none"
          >
            <span>View Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Chat Agency */}
          {trip.chatRoute && (
            <button
              type="button"
              onClick={() => navigate(trip.chatRoute)}
              className="py-2.5 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-white/10 focus:outline-none"
              title="Chat with Agency"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Chat Agency</span>
            </button>
          )}

          {/* Documents */}
          {trip.documentsRoute && (
            <button
              type="button"
              onClick={() => navigate(trip.documentsRoute)}
              className="py-2.5 px-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-100 dark:border-blue-900/40 focus:outline-none"
              title="View Travel Documents"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Documents</span>
            </button>
          )}

          {/* Emergency */}
          {trip.emergencyPhone && (
            <button
              type="button"
              onClick={() => setIsEmergencyOpen(true)}
              className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-all cursor-pointer border border-rose-100 dark:border-rose-900/40 focus:outline-none"
              title="Emergency Contact"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Emergency Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isEmergencyOpen && trip.emergencyPhone && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                  <h4 className="text-base font-black text-[#0F172A] dark:text-white">Emergency Assistance</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmergencyOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 leading-relaxed">
                Connect directly with your trip operations team for immediate assistance.
              </p>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-500 dark:text-rose-400 block">
                    Emergency Line
                  </span>
                  <span className="text-sm font-black text-rose-900 dark:text-rose-200 block">
                    {trip.emergencyPhone}
                  </span>
                </div>
                <a
                  href={`tel:${trip.emergencyPhone}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-xs shadow-rose-600/20 hover:bg-rose-700 transition-all"
                >
                  Call Now
                </a>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergencyOpen(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CurrentTripCard;
