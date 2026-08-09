import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripSummaryCardProps {
  tripId: string;
  packageName: string;
  coverImage: string;
  dateRangeText: string;
  destinationRoute: string;
  travelerCount: number;
  capacity: number;
  statusText: string;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  tripId,
  packageName,
  coverImage,
  dateRangeText,
  destinationRoute,
  travelerCount,
  capacity,
  statusText,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <img
          src={coverImage}
          alt={packageName}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shrink-0 shadow-2xs"
        />

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-[#0F172A] truncate">
              {packageName}
            </h3>
            <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#583BE8] text-[10px] font-black border border-purple-100">
              {tripId}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500 font-semibold truncate">
            <div className="flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
              <span>{dateRangeText}</span>
            </div>

            <div className="hidden sm:block text-slate-300">•</div>

            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{destinationRoute}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-0.5">
            <div className="flex items-center gap-1 text-xs text-slate-600 font-bold">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{travelerCount} / {capacity} Travelers</span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {statusText}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/agency/trips/${tripId}`)}
        className="px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
      >
        <span>View Trip Details</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default TripSummaryCard;
