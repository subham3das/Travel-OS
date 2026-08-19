import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Building2,
  Users,
  Phone,
  Cloud,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  Send,
  Download,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminTripItem } from '../../../types/tripManagement';

interface TripDetailsDrawerProps {
  trip: AdminTripItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackLive: (trip: AdminTripItem) => void;
  onViewManifest: (trip: AdminTripItem) => void;
  onNotifyTravelers: (trip: AdminTripItem) => void;
  onDownloadReport: (trip: AdminTripItem) => void;
  onContactGuide: (trip: AdminTripItem) => void;
}

export const TripDetailsDrawer: React.FC<TripDetailsDrawerProps> = ({
  trip,
  isOpen,
  onClose,
  onTrackLive,
  onViewManifest,
  onNotifyTravelers,
  onDownloadReport,
  onContactGuide,
}) => {
  if (!isOpen || !trip) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sliding Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[480px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* ── 1. Top Hero Section with Destination Image ── */}
            <div className="relative h-52 sm:h-56 w-full shrink-0 overflow-hidden">
              <img
                src={trip.heroImage || trip.packageImage}
                alt={trip.packageName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Status Badge on Top Right */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                    trip.status === 'Running'
                      ? 'bg-emerald-500 text-white'
                      : trip.status === 'Upcoming'
                      ? 'bg-blue-500 text-white'
                      : trip.status === 'Completed'
                      ? 'bg-slate-800 text-white'
                      : trip.status === 'Delayed'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {trip.status}
                </span>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs"
                  title="Close Details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Destination & Package Title Over Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h2 className="text-xl font-black tracking-tight">{trip.packageName}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {trip.destinationCity ? `${trip.destinationCity}, ` : ''}
                    {trip.destinationState || trip.destination}, India
                  </span>
                </div>
              </div>
            </div>

            {/* ── 2. Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Badges Bar */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
                <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 font-mono text-[#6356E5]">
                  {trip.id}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{trip.agencyName}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{trip.travelersCount} Travelers</span>
                </span>
              </div>

              {/* Trip Progress Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-700">Trip Progress</span>
                  <span className="font-black font-mono text-[#6356E5] text-sm">{trip.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      trip.status === 'Running'
                        ? 'bg-[#6356E5]'
                        : trip.status === 'Completed'
                        ? 'bg-emerald-500'
                        : trip.status === 'Delayed'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${trip.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Details Card */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 text-xs">
                {/* Guide */}
                <div className="py-2.5 first:pt-0 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Guide</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={trip.guide.avatar}
                      alt={trip.guide.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-black text-[#0F172A]">{trip.guide.name}</span>
                    <button
                      onClick={() => onContactGuide(trip)}
                      className="w-6 h-6 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#6356E5] flex items-center justify-center transition-colors cursor-pointer"
                      title="Call Guide"
                    >
                      <Phone className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Vehicle</span>
                  <span className="font-bold text-slate-800 text-right">{trip.vehicle}</span>
                </div>

                {/* Departure */}
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Departure</span>
                  <span className="font-mono font-bold text-slate-800">
                    {trip.departureDate} ({trip.departureTime})
                  </span>
                </div>

                {/* Return */}
                <div className="py-2.5 last:pb-0 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Return</span>
                  <span className="font-mono font-bold text-slate-800">
                    {trip.returnDate} ({trip.returnTime})
                  </span>
                </div>
              </div>

              {/* Live Trip Stats */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Live Trip Stats
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Travelers Checked In</span>
                    <span className="font-black font-mono text-[#0F172A]">
                      {trip.liveStats.travelersCheckedIn} / {trip.liveStats.totalTravelers}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Seats Filled</span>
                    <span className="font-black font-mono text-[#0F172A]">
                      {trip.liveStats.seatsFilledPercentage}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Current Location</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[210px]">
                      {trip.liveStats.currentLocation}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">ETA Next Stop</span>
                    <span className="font-black font-mono text-[#6356E5]">
                      {trip.liveStats.etaNextStop}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-semibold">Weather</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{trip.liveStats.weatherTemp}, {trip.liveStats.weather}</span>
                      <Cloud className="w-3.5 h-3.5 text-slate-400" />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Timeline Stream */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Trip Timeline
                </span>

                <div className="space-y-3 relative pl-4">
                  {/* Vertical connector line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />

                  {trip.timeline.map((item, idx) => (
                    <div key={item.id || idx} className="relative flex items-start justify-between gap-2 text-xs">
                      {/* Status indicator bullet */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 absolute -left-[14px] top-0.5 shadow-2xs ${
                          item.status === 'completed'
                            ? 'bg-emerald-500'
                            : item.status === 'active'
                            ? 'bg-[#6356E5] ring-4 ring-purple-100 animate-pulse'
                            : 'bg-slate-300'
                        }`}
                      />

                      <span
                        className={`font-bold truncate ${
                          item.status === 'active'
                            ? 'text-[#6356E5] font-black'
                            : item.status === 'completed'
                            ? 'text-slate-800'
                            : 'text-slate-400 font-normal'
                        }`}
                      >
                        {item.title}
                      </span>

                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          item.status === 'active'
                            ? 'text-[#6356E5] font-black'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 3. Quick Actions Footer (4 Buttons) ── */}
            <div className="p-5 bg-white border-t border-slate-200/80 space-y-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {/* Track Live */}
                <button
                  onClick={() => onTrackLive(trip)}
                  className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Track Live</span>
                </button>

                {/* View Manifest */}
                <button
                  onClick={() => onViewManifest(trip)}
                  className="py-2.5 px-3 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm shadow-[#6356E5]/20 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>View Manifest</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Notify Travelers */}
                <button
                  onClick={() => onNotifyTravelers(trip)}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Notify Travelers</span>
                </button>

                {/* Download Report */}
                <button
                  onClick={() => onDownloadReport(trip)}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
