import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, IndianRupee, FileCheck, Edit, Megaphone, Play, Lock } from 'lucide-react';
import { DetailedTripInfo } from '../../data/tripDetails';

interface TripHeroCardProps {
  trip: DetailedTripInfo;
  isSetupComplete?: boolean;
  onEditTrip?: () => void;
  onAnnouncements?: () => void;
  onStartTrip?: () => void;
}

export const TripHeroCard: React.FC<TripHeroCardProps> = ({
  trip,
  isSetupComplete = true,
  onEditTrip,
  onAnnouncements,
  onStartTrip,
}) => {
  const isPendingSetup = !isSetupComplete || trip.statusCategory === 'Pending Setup';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 select-none"
    >
      {/* Top Flex Container: Cover Image + Header & Action Buttons */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-5">
        {/* Cover Image with Status Overlay */}
        <div className="relative w-full md:w-56 h-44 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
          <img
            src={trip.coverImage}
            alt={trip.packageName}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute bottom-3 left-3 px-3 py-1 rounded-full backdrop-blur-sm text-white text-[11px] font-black shadow-md flex items-center gap-1.5 ${
              isPendingSetup ? 'bg-amber-500/90' : 'bg-emerald-500/90'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{trip.statusText}</span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex-1 space-y-3 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  {trip.packageName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#583BE8] text-[11px] font-black border border-purple-100">
                  {trip.tripId}
                </span>
              </div>
            </div>

            {/* Top Right Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onEditTrip}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/50 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-[#583BE8]" />
                <span>Edit Trip</span>
              </button>

              <button
                type="button"
                onClick={onAnnouncements}
                className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/50 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Announcements</span>
              </button>

              <button
                type="button"
                disabled={isPendingSetup}
                onClick={onStartTrip}
                title={isPendingSetup ? 'Complete all assignments before activating' : 'Start Trip'}
                className={`px-4 py-1.5 rounded-xl text-white text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  isPendingSetup
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-[#583BE8] hover:bg-[#492de0] shadow-md shadow-[#583BE8]/20 cursor-pointer'
                }`}
              >
                {isPendingSetup ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isPendingSetup ? 'Locked' : 'Start Trip'}</span>
              </button>
            </div>
          </div>

          {/* Row 1: Date & Route */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-600 font-semibold pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#583BE8] shrink-0" />
              <span>{trip.dateRangeText}</span>
            </div>

            <div className="hidden sm:block text-slate-300">•</div>

            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{trip.destinationRoute}</span>
            </div>
          </div>

          {/* Row 2: 3 Key Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50/80 border border-slate-100">
              <Users className="w-4 h-4 text-[#583BE8] shrink-0" />
              <div>
                <span className="font-extrabold text-[#0F172A] block leading-tight">
                  {trip.travelerCount} / {trip.capacity}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">Travelers</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50/80 border border-slate-100">
              <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-[#0F172A] block leading-tight">
                  {trip.totalRevenue}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">Total Revenue</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50/80 border border-slate-100">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-700 block leading-tight">
                  {trip.status}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripHeroCard;
