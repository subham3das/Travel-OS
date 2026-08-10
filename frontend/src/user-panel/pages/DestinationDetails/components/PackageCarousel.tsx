import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface PackageCarouselProps {
  destination: Destination;
}

export const PackageCarousel: React.FC<PackageCarouselProps> = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Popular Packages
        </h2>
        <button
          onClick={() => navigate('/search?tab=packages')}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {destination.packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => navigate(`/package/${pkg.id}`)}
            className="w-60 sm:w-64 bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden shrink-0 flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="relative w-full h-36 overflow-hidden bg-slate-100">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {pkg.bestseller && (
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#FF4D6D] text-white text-[10px] font-black shadow-xs">
                  BESTSELLER
                </div>
              )}
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#6356E5]" />
                  <span>{pkg.duration}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-sm font-black text-[#0F172A]">{pkg.price}</span>
                <span className="text-xs font-extrabold text-[#6356E5] hover:underline">
                  View Package
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
