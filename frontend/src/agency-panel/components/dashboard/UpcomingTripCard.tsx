import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AgencyUpcomingTrip } from '../../data/dashboard';

interface UpcomingTripCardProps {
  trip: AgencyUpcomingTrip;
  onClick?: () => void;
}

export const UpcomingTripCard: React.FC<UpcomingTripCardProps> = ({ trip, onClick }) => {
  const getBadgeStyle = (color: AgencyUpcomingTrip['badgeColor']) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100/70 text-[#583BE8]';
      case 'amber':
        return 'bg-amber-100/70 text-amber-700';
      case 'blue':
        return 'bg-sky-100/70 text-sky-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
    >
      {/* Left: Image & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-14 h-12 sm:w-16 sm:h-12 rounded-xl object-cover border border-slate-100 shrink-0 shadow-2xs"
        />

        <div className="space-y-0.5 min-w-0">
          <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
            {trip.name}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            {trip.startDateText} • {trip.travelerCount} Travelers
          </p>
        </div>
      </div>

      {/* Right: Badge & Chevron */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${getBadgeStyle(trip.badgeColor)}`}>
          {trip.badgeText}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors" />
      </div>
    </div>
  );
};

export default UpcomingTripCard;
