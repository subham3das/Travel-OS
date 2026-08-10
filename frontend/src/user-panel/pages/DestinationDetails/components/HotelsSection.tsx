import React from 'react';
import { Star, Building2 } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface HotelsSectionProps {
  destination: Destination;
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ destination }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Hotels Nearby
        </h2>
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' hotels')}`, '_blank')}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {destination.hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="w-56 sm:w-64 bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden shrink-0 flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="relative w-full h-32 overflow-hidden bg-slate-100">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] truncate">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 pt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-black text-[#0F172A]">{hotel.price}</span>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + destination.name)}`, '_blank')}
                  className="px-3 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-[11px] font-extrabold shadow-2xs transition-all cursor-pointer"
                >
                  Book Hotel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
