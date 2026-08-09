import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface AgencyCarouselProps {
  destination: Destination;
}

export const AgencyCarousel: React.FC<AgencyCarouselProps> = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Nearby Travel Agencies
        </h2>
        <button
          onClick={() => navigate('/agencies')}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {destination.nearbyAgencies.map((agency) => (
          <div
            key={agency.id}
            onClick={() => navigate(`/agency/${agency.id}`)}
            className="p-3.5 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3 shrink-0 group min-w-[200px]"
          >
            <img
              src={agency.logo}
              alt={agency.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
            />
            <div className="space-y-0.5 truncate">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
                {agency.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{agency.rating}</span>
                </span>
                {agency.verified && (
                  <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold">
                    <CheckCircle2 className="w-3 h-3 fill-emerald-500 text-white" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
