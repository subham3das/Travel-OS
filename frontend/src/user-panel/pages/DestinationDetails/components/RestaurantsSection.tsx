import React from 'react';
import { Star, Utensils, Navigation } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface RestaurantsSectionProps {
  destination: Destination;
}

export const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ destination }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Restaurants Nearby
        </h2>
        <button
          onClick={() => alert(`Showing all restaurants in ${destination.name}`)}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {destination.restaurants.map((rest) => (
          <div
            key={rest.id}
            className="w-56 sm:w-64 bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden shrink-0 flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="relative w-full h-32 overflow-hidden bg-slate-100">
              <img
                src={rest.image}
                alt={rest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] truncate">{rest.name}</h3>
                <p className="text-xs font-semibold text-slate-400 truncate">{rest.cuisine}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rest.rating}</span>
                </div>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.name + ' ' + destination.name)}`,
                      '_blank'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
