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
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col justify-between h-full w-full min-w-0 overflow-hidden">
      {/* Header with Title + Dropdown */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <h3 className="text-sm font-black text-[#0F172A] truncate">Revenue by Destination</h3>

        <div className="relative shrink-0">
          <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-100 transition-colors">
            <span>Top 6 Destinations</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-48 sm:h-52 w-full flex flex-col justify-end pt-3 pb-1 min-w-0">
        {/* Main Chart with Y-Axis gutter on left and Bars on right */}
        <div className="flex items-stretch flex-1 min-w-0 relative">
          {/* Y Axis Labels */}
          <div className="w-8 shrink-0 flex flex-col justify-between text-[9px] font-bold text-slate-300 pb-1 pointer-events-none select-none text-left">
            <span>₹5Cr</span>
            <span>₹4Cr</span>
            <span>₹3Cr</span>
            <span>₹2Cr</span>
            <span>₹1Cr</span>
            <span>₹0</span>
          </div>

          {/* Grid lines & Bars container */}
          <div className="flex-1 relative min-w-0 flex flex-col justify-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
            </div>

            {/* Bars Grid */}
            <div className="relative z-10 grid grid-cols-6 gap-1 sm:gap-2 h-36 px-1 items-end w-full min-w-0">
              {destinations.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end h-full min-w-0 group cursor-pointer">
                  {/* Amount label */}
                  <span className="text-[9px] font-extrabold text-slate-600 group-hover:text-[#6356E5] transition-colors truncate max-w-full text-center mb-1">
                    {d.amount}
                  </span>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[22px] sm:max-w-[26px] bg-[#6356E5] rounded-t-md sm:rounded-t-lg transition-all group-hover:bg-[#5244e0] group-hover:shadow-md group-hover:shadow-[#6356E5]/30"
                    style={{ height: `${Math.max(d.heightPercent, 8)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X Axis Labels */}
        <div className="flex items-center w-full min-w-0 pt-2 border-t border-slate-100 mt-1">
          <div className="w-8 shrink-0" />
          <div className="flex-1 grid grid-cols-6 gap-1 sm:gap-2 px-1 text-[9px] font-bold text-slate-500 text-center min-w-0">
            {destinations.map((d, idx) => (
              <span key={idx} className="truncate block" title={d.destination}>
                {d.destination}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
