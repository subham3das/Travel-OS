import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, Calendar, Users, BarChart3, Clock } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface PackageOverviewProps {
  pkg: TourPackage;
}

export const PackageOverview: React.FC<PackageOverviewProps> = ({ pkg }) => {
  const navigate = useNavigate();

  return (
    <div className="relative -mt-6 z-20 w-full bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5">
      {/* Header Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          {/* Badge */}
          {pkg.badge && (
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#6356E5] text-white text-[11px] font-bold tracking-tight shadow-2xs">
              {pkg.badge}
            </span>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
            {pkg.title}
          </h1>

          {/* Agency & Ratings Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold text-slate-500">
            <span>by</span>
            <button
              onClick={() => navigate(`/agency/${pkg.agencyId}`)}
              className="text-[#6356E5] font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{pkg.agencyName}</span>
              {pkg.agencyVerified !== false && (
                <CheckCircle2 className="w-4 h-4 text-[#6356E5] fill-[#6356E5]/10 shrink-0" />
              )}
            </button>

            <span className="text-slate-300">•</span>

            <span className="flex items-center gap-1 font-extrabold text-[#0F172A]">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{pkg.rating}</span>
              <span className="text-slate-400 font-semibold">({pkg.reviewCount} Reviews)</span>
            </span>

            {pkg.agencyLocation && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{pkg.agencyLocation}</span>
              </>
            )}
          </div>
        </div>

        {/* Price Column */}
        <div className="sm:text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{pkg.price}</p>
          <p className="text-xs font-semibold text-slate-400">/ person</p>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Starting from</p>
        </div>
      </div>

      {/* 4 Stats Grid Bar */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FC] border border-slate-100 text-center">
        <div className="flex flex-col items-center justify-center p-1">
          <Calendar className="w-4 h-4 text-[#6356E5] mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
            {pkg.duration}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Duration</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 min-[480px]:border-l">
          <Users className="w-4 h-4 text-purple-600 mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
            {pkg.groupSize}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Group Size</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 min-[480px]:border-l">
          <BarChart3 className="w-4 h-4 text-indigo-600 mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
            {pkg.difficulty}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Difficulty</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-l border-slate-200/60 min-[480px]:border-l">
          <Clock className="w-4 h-4 text-sky-600 mb-1" />
          <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
            {pkg.bestTime}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Best Time</span>
        </div>
      </div>
    </div>
  );
};
