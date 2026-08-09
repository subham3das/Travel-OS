import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Clock } from 'lucide-react';
import { packagesData } from '../../../data/packages';

interface SimilarPackagesProps {
  currentPackageId: string;
}

export const SimilarPackages: React.FC<SimilarPackagesProps> = ({ currentPackageId }) => {
  const navigate = useNavigate();

  const similarList = packagesData.filter((p) => p.id !== currentPackageId).slice(0, 4);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Similar Packages
        </h2>
        <button
          onClick={() => navigate('/explore')}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {similarList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              navigate(`/package/${item.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-64 sm:w-72 bg-white rounded-3xl overflow-hidden border border-slate-100/90 shadow-2xs hover:shadow-md transition-all shrink-0 flex flex-col justify-between cursor-pointer group"
          >
            <div className="relative h-36 w-full overflow-hidden bg-slate-100">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                {item.duration}
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight line-clamp-1 group-hover:text-[#6356E5] transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center justify-between gap-1 text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </span>

                <div className="text-right">
                  <span className="text-base font-black text-[#0F172A]">{item.price}</span>
                  <span className="text-[10px] text-slate-400 font-semibold ml-0.5">/ person</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
