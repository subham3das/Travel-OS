import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { packagesData } from '../../../data/packages';
import { TourPackage } from '../../../types/package';

export const SuggestedTrips: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Suggested For You
      </h3>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {packagesData.slice(0, 4).map((pkg: TourPackage) => (
          <div
            key={pkg.id}
            onClick={() => navigate(`/package/${pkg.id}`)}
            className="w-56 sm:w-64 bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden shrink-0 flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="relative w-full h-28 overflow-hidden bg-slate-100">
              <img
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-3 space-y-1.5">
              <h4 className="text-xs font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
                {pkg.title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#6356E5]" /> {pkg.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-current" /> {pkg.rating}
                </span>
              </p>
              <p className="text-xs font-black text-[#0F172A] pt-0.5">
                From {pkg.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
