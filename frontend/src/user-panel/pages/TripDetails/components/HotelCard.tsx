import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface HotelCardProps {
  trip: Trip;
}

export const HotelCard: React.FC<HotelCardProps> = ({ trip }) => {
  const { hotel } = trip;

  return (
    <div
      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.address)}`, '_blank')}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hotel Details</h3>
          <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
            {hotel.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {hotel.checkIn}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0" />
    </div>
  );
};
