import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { DESTINATIONS_DATA } from '../../../data/destinations';

export const TrendingDestinations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Trending Destinations
        </h3>
        <button
          onClick={() => navigate('/explore')}
          className="text-xs font-extrabold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {DESTINATIONS_DATA.slice(0, 5).map((dest) => (
          <div
            key={dest.id}
            onClick={() => navigate(`/destination/${dest.id}`)}
            className="relative w-40 sm:w-48 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-2xs group cursor-pointer shrink-0 border border-slate-100"
          >
            <img
              src={dest.heroImage}
              alt={dest.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-amber-400 text-[10px] font-extrabold flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-current" />
              <span>{dest.rating}</span>
            </div>

            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                {dest.name}
              </h4>
              <p className="text-[10px] font-semibold text-white/80 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>{dest.state}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
