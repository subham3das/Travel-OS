import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, MoreVertical } from 'lucide-react';
import { DestinationRevenueItem } from '../../../types/financeManagement';

interface RevenueDestinationChartProps {
  destinations: DestinationRevenueItem[];
}

export const RevenueDestinationChart: React.FC<RevenueDestinationChartProps> = ({ destinations }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Revenue by Destination</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-[#6356E5]">
              Top 6
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Highest earning travel destinations
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Bar Chart Area */}
      <div className="pt-6 pb-2">
        <div className="flex items-end justify-between gap-3 h-44 px-2">
          {destinations.map((item, index) => {
            return (
              <div
                key={item.destination}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
              >
                {/* Revenue Tag on Hover / Top */}
                <div className="opacity-80 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <span className="text-[10px] font-black text-[#0F172A] font-mono whitespace-nowrap">
                    {item.amount}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 flex items-center">
                    ↑{index === 0 ? '24.5%' : index === 1 ? '18.2%' : '14.1%'}
                  </span>
                </div>

                {/* Animated Vertical Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-2xl p-1 flex items-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.heightPercent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                    className={`w-full rounded-xl transition-all duration-300 ${
                      index === 0
                        ? 'bg-gradient-to-t from-[#6356E5] to-[#8B7FF8] shadow-md shadow-[#6356E5]/30'
                        : index === 1
                        ? 'bg-gradient-to-t from-[#7A6EED] to-[#9E93FA]'
                        : 'bg-gradient-to-t from-[#9B90F5] to-[#BCB4FC] group-hover:from-[#6356E5] group-hover:to-[#8B7FF8]'
                    }`}
                  />
                </div>

                {/* Destination Name */}
                <div className="text-center mt-1">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#6356E5] transition-colors block truncate max-w-[54px]">
                    {item.destination}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 block font-mono">
                    {index === 0 ? '1,420 trips' : index === 1 ? '1,180 trips' : '940 trips'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Meghalaya accounts for <strong>28.4%</strong> of destination GMV</span>
        </div>
        <button className="text-[11px] font-extrabold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>All Regions</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
