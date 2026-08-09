import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TravelerCardProps {
  trip: Trip;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({ trip }) => {
  return (
    <div
      onClick={() => alert(`Travelers:\n${trip.travelers.map((t) => `${t.name} (${t.phone})`).join('\n')}`)}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#0F172A] truncate">Traveler Details</h3>
          <p className="text-xs font-bold text-emerald-600">{trip.travelerCount} Travelers</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 overflow-hidden">
          {trip.travelers.map((t, idx) => (
            <img
              key={idx}
              src={t.avatar}
              alt={t.name}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
            />
          ))}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0" />
      </div>
    </div>
  );
};
