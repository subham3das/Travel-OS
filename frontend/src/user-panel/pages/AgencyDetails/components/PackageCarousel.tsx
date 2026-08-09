import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { AgencyPackage } from '../../../types/agency';

interface PackageCarouselProps {
  packages: AgencyPackage[];
}

export const PackageCarousel: React.FC<PackageCarouselProps> = ({ packages }) => {
  const navigate = useNavigate();

  const getBadgeStyle = (type?: string) => {
    if (type === 'bestseller') return 'bg-[#6356E5] text-white';
    if (type === 'new') return 'bg-[#6356E5] text-white';
    return 'bg-[#6356E5] text-white';
  };

  if (!packages || packages.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
          Top Packages
        </h3>
        <button
          onClick={() => navigate('/search/results?tab=packages')}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/package/${pkg.id}`)}
            className="w-64 sm:w-72 rounded-3xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md transition-all overflow-hidden shrink-0 cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative w-full h-40 overflow-hidden bg-slate-100">
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {pkg.badge && (
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-xs ${getBadgeStyle(
                    pkg.badgeType
                  )}`}
                >
                  {pkg.badge}
                </div>
              )}
            </div>

            <div className="p-4 space-y-1.5">
              <h4 className="text-base font-black text-[#0F172A] tracking-tight line-clamp-1">
                {pkg.title}
              </h4>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>{pkg.duration}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  {pkg.rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-base sm:text-lg font-black text-[#0F172A]">{pkg.price}</span>
                  <span className="text-xs text-slate-400 font-medium"> / person</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
