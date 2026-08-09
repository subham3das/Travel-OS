import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OccupancyData } from '../../data/dashboardInsights';

interface OccupancyCardProps {
  data: OccupancyData;
}

export const OccupancyCard: React.FC<OccupancyCardProps> = ({ data }) => {
  const strokeDashoffset = 251.2 - (251.2 * data.percentage) / 100;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex flex-col justify-between items-center text-center">
      <div className="w-full text-left">
        <span className="text-xs font-bold text-slate-500">Occupancy (Avg.)</span>
      </div>

      {/* Big Percentage & Growth */}
      <div className="space-y-0.5">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          {data.percentage}%
        </h3>
        <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" />
          <span>{data.growthText}</span>
        </p>
      </div>

      {/* SVG Circular Ring Chart */}
      <div className="relative w-24 h-24 my-1 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#583BE8"
            strokeWidth="10"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>

      {/* Bottom Subtitle */}
      <div className="w-full border-t border-slate-100 pt-2 text-center">
        <p className="text-xs font-black text-[#0F172A]">{data.tripsRatioText}</p>
        <p className="text-[10px] font-bold text-slate-400">{data.monthText}</p>
      </div>
    </div>
  );
};

export default OccupancyCard;
