import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, User, ChevronRight } from 'lucide-react';
import { AgencyTrip } from '../../data/trips';

interface TripCardProps {
  trip: AgencyTrip;
  onClick?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const getBadgeClass = (color: AgencyTrip['badgeColor']) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100/80 text-[#583BE8]';
      case 'amber':
        return 'bg-amber-100/80 text-amber-800';
      case 'blue':
        return 'bg-sky-100/80 text-sky-800';
      case 'emerald':
        return 'bg-emerald-100/80 text-emerald-800';
      case 'rose':
        return 'bg-rose-100/80 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer select-none group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      {/* Left Group: Cover Image & Primary Info */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1 w-full sm:w-auto">
        {/* Image with Day Badge Overlay */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-2xs border border-slate-100">
          <img
            src={trip.coverImage}
            alt={trip.packageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-xl bg-[#583BE8] text-white text-center shadow-md">
            <span className="text-xs font-black leading-none block">
              {trip.dayBadge.split(' ')[0]}
            </span>
            <span className="text-[9px] font-bold uppercase block text-purple-200">
              {trip.dayBadge.split(' ')[1]}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
              {trip.packageName}
            </h3>
            <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#583BE8] text-[10px] font-black tracking-wide border border-purple-100/80 shrink-0">
              {trip.tripId}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{trip.destinationRoute}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-[#0F172A]">
              {trip.travelerCount} / {trip.capacity}
            </span>
            <span className="text-slate-400">Travelers</span>
          </div>
        </div>
      </div>

      {/* Right Group: Status, Dates, Guide & Action Chevron */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="space-y-1.5 text-left sm:text-right min-w-0">
          {/* Status Badge */}
          <div className="flex sm:justify-end">
            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${getBadgeClass(trip.badgeColor)}`}>
              {trip.statusBadgeText}
            </span>
          </div>

          {/* Date Range */}
          <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 sm:hidden" />
            <span>{trip.dateRangeText}</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
          </div>

          {/* Assigned Guide */}
          <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0 sm:hidden" />
            <span className="truncate">{trip.guideName}</span>
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
          </div>
        </div>

        {/* Chevron Arrow */}
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#583BE8] transition-colors shrink-0" />
      </div>
    </motion.div>
  );
};

export default TripCard;
