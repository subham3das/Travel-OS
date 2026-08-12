import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { BookingMetric } from '../../types/dashboard';
import { CustomAreaChart } from '../common/CustomAreaChart';

interface BookingTrendCardProps {
  metric: BookingMetric;
}

export const BookingTrendCard: React.FC<BookingTrendCardProps> = ({ metric }) => {
  const [filter, setFilter] = useState('This Month');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight">{metric.title}</h3>
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80 cursor-pointer"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Metric Value & Growth */}
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
          {metric.currentValue}
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          <span>{metric.growthPct}</span>
        </span>
      </div>

      {/* SVG Smooth Chart */}
      <div className="mt-4">
        <CustomAreaChart data={metric.dataPoints} color="blue" yAxisSuffix="K" />
      </div>

      {/* Footer Summary */}
      <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>{metric.footerText}</span>
        <span className="text-blue-600 font-extrabold cursor-pointer hover:underline">View Bookings</span>
      </div>
    </motion.div>
  );
};
