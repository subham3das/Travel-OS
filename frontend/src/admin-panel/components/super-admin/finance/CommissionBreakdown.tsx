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
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none flex flex-col justify-between h-full">
      <h3 className="text-sm font-black text-[#0F172A]">Commission Breakdown</h3>

      <div className="flex items-center gap-6 justify-center flex-1 py-1">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
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
        <div className="space-y-2 text-xs flex-1 min-w-0">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-600 text-[11px] truncate">
                  {item.name}
                </span>
              </div>
              <span className="font-extrabold text-[#0F172A] text-[11px] whitespace-nowrap">
                {item.amount} <span className="text-[10px] text-slate-400 font-semibold">({item.percentage})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
