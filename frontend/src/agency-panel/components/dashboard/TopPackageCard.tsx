import React from 'react';
import { TopPackageData } from '../../data/dashboardInsights';

interface TopPackageCardProps {
  data: TopPackageData;
}

export const TopPackageCard: React.FC<TopPackageCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex flex-col justify-between items-center text-center">
      <div className="w-full text-left">
        <span className="text-xs font-bold text-slate-500">Top Package</span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-black text-[#583BE8] tracking-tight truncate max-w-[150px]">
          {data.packageName}
        </h4>
        <p className="text-xs font-extrabold text-[#0F172A]">{data.bookingsCount}</p>
        <p className="text-[11px] font-bold text-slate-400">{data.revenueText}</p>
      </div>

      {/* Package Image Thumbnail */}
      <div className="w-20 h-16 rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-slate-100 shrink-0">
        <img
          src={data.coverImage}
          alt={data.packageName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Badge */}
      <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-black inline-flex items-center gap-1 shadow-2xs">
        <span>{data.badgeText}</span>
      </div>
    </div>
  );
};

export default TopPackageCard;
