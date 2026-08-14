import React from 'react';
import { CommissionBreakdownItem } from '../../../types/financeManagement';

interface CommissionBreakdownProps {
  items: CommissionBreakdownItem[];
}

export const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ items }) => {
  // Compute SVG Donut segments using strokeDasharray
  const total = items.reduce((acc, curr) => acc + curr.value, 0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col justify-between h-full w-full min-w-0 overflow-hidden">
      <h3 className="text-sm font-black text-[#0F172A] truncate">Commission Breakdown</h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center flex-1 py-1 min-w-0">
        {/* SVG Donut */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {items.map((item, idx) => {
              const strokeLength = (item.value / total) * circumference;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += strokeLength;

              if (item.value === 0) return null;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="16"
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-bold text-slate-400">Total GMV</span>
            <span className="text-xs font-black text-[#0F172A]">₹24.68 Cr</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-xs flex-1 w-full min-w-0">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-600 text-[11px] truncate">
                  {item.name}
                </span>
              </div>
              <span className="font-extrabold text-[#0F172A] text-[11px] whitespace-nowrap shrink-0">
                {item.amount} <span className="text-[10px] text-slate-400 font-semibold">({item.percentage})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
