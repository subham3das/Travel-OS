import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, MoreVertical, Info } from 'lucide-react';
import { CommissionBreakdownItem } from '../../../types/financeManagement';

interface CommissionBreakdownProps {
  items: CommissionBreakdownItem[];
}

export const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Commission Breakdown</h3>
            <div className="group relative cursor-pointer">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap z-30 shadow-lg">
                Revenue distribution split
              </div>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Platform share vs agency earnings
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Donut Chart & Center Text */}
      <div className="flex items-center justify-center py-4 relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {items.map((item, index) => {
            const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += item.value;
            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Metric */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {hoveredIndex !== null ? items[hoveredIndex].name : 'Platform Share'}
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight font-mono">
            {hoveredIndex !== null ? items[hoveredIndex].percentage : '15.2%'}
          </span>
          <span className="text-[10px] font-extrabold text-[#6356E5]">
            {hoveredIndex !== null ? items[hoveredIndex].amount : '₹3.74 Cr'}
          </span>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="space-y-2 pt-2 border-t border-slate-100/80">
        {items.map((item, index) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between text-xs p-1 rounded-xl transition-all cursor-pointer ${
              hoveredIndex === index ? 'bg-slate-50 font-bold' : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-semibold truncate text-[11px]">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-black text-[#0F172A] font-mono">
                {item.amount}
              </span>
              <span className="text-[10px] font-bold text-slate-400 w-9 text-right font-mono">
                {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
