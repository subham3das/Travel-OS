import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_STATUS_DISTRIBUTION } from '../../data/dashboard';

export const StatusDistributionChart: React.FC = () => {
  const total = MOCK_STATUS_DISTRIBUTION.reduce((acc, item) => acc + item.count, 0);

  // Calculate SVG Donut Arcs using strokeDasharray
  const radius = 65;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col items-center justify-between"
    >
      <h3 className="text-sm font-extrabold text-[#0F172A] self-start">Applications by Status</h3>

      {/* Donut Container */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {MOCK_STATUS_DISTRIBUTION.map((item, index) => {
            const strokeDashoffset = -(accumulatedPercentage * circumference) / 100;
            const strokeDasharray = `${(item.percentage * circumference) / 100} ${circumference}`;
            accumulatedPercentage += item.percentage;

            return (
              <circle
                key={index}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:opacity-90 cursor-pointer"
              >
                <title>{`${item.label}: ${item.count} (${item.percentage}%)`}</title>
              </circle>
            );
          })}
        </svg>

        {/* Center Text Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-[#0F172A] tracking-tight">{total}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 w-full pt-1">
        {MOCK_STATUS_DISTRIBUTION.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-bold text-slate-600 truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatusDistributionChart;
