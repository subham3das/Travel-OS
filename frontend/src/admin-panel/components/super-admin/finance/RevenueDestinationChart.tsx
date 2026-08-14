import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DestinationRevenueItem } from '../../../types/financeManagement';

interface RevenueDestinationChartProps {
  destinations: DestinationRevenueItem[];
}

export const RevenueDestinationChart: React.FC<RevenueDestinationChartProps> = ({
  destinations,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none flex flex-col justify-between h-full">
      {/* Header with Title + Dropdown */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black text-[#0F172A]">Revenue by Destination</h3>

        <div className="relative">
          <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            <span>Top 6 Destinations</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-48 sm:h-52 w-full flex flex-col justify-end pt-4 pb-2">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none pb-7">
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹5Cr</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹4Cr</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹3Cr</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹2Cr</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹1Cr</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>₹0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex items-end justify-between gap-2 px-6 h-36">
          {destinations.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-extrabold text-slate-700 opacity-80 group-hover:opacity-100 group-hover:text-[#6356E5] transition-colors whitespace-nowrap">
                {d.amount}
              </span>
              <div
                className="w-full max-w-[28px] bg-[#6356E5] rounded-t-lg transition-all group-hover:bg-[#5244e0] group-hover:shadow-md group-hover:shadow-[#6356E5]/30 cursor-pointer"
                style={{ height: `${d.heightPercent}%` }}
              />
            </div>
          ))}
        </div>

        {/* X Axis Labels */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 px-2 border-t border-slate-100 mt-1">
          {destinations.map((d, idx) => (
            <span key={idx} className="flex-1 text-center truncate px-0.5">
              {d.destination}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
