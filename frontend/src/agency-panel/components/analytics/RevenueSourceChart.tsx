import React from 'react';
import { RevenueSourceItem } from '../../data/analytics';

interface RevenueSourceChartProps {
  sources: RevenueSourceItem[];
  totalRevenue: string;
}

export const RevenueSourceChart: React.FC<RevenueSourceChartProps> = ({ sources, totalRevenue }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Revenue by Source
        </span>

        <select className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer">
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      {/* SVG Donut Chart & Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Donut Circle */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Direct Bookings 42% (105.5 stroke) */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#583BE8" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" />
            {/* Platform 35% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#0EA5E9" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="100.2" />
            {/* Repeat 15% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="183.7" />
            {/* Referrals 8% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="219.6" />
          </svg>

          <div className="absolute text-center">
            <span className="text-[11px] font-black text-[#0F172A] block leading-tight">
              {totalRevenue}
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 block">Total</span>
          </div>
        </div>

        {/* Legend Column */}
        <div className="flex-1 space-y-2.5 w-full">
          {sources.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="text-[#0F172A] font-black">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueSourceChart;
