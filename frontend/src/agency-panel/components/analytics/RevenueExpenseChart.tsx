import React from 'react';
import { RevenueExpenseDataPoint } from '../../data/analytics';

interface RevenueExpenseChartProps {
  data: RevenueExpenseDataPoint[];
}

export const RevenueExpenseChart: React.FC<RevenueExpenseChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Revenue vs Expenses
        </span>

        <select className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer">
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      {/* Legend Indicators */}
      <div className="flex items-center justify-end gap-4 text-[11px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#583BE8]" />
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span>Expenses</span>
        </div>
      </div>

      {/* Lightweight SVG Grouped Bar Chart */}
      <div className="pt-2">
        <svg viewBox="0 0 350 100" className="w-full h-28 overflow-visible">
          {/* Y Grid Lines */}
          <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="350" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="350" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

          {data.map((pt, idx) => {
            const xGroup = 35 + idx * 70;
            const revHeight = (pt.revenue / 100) * 70;
            const expHeight = (pt.expenses / 100) * 70;

            return (
              <g key={pt.date}>
                {/* Revenue Bar (Purple) */}
                <rect
                  x={xGroup}
                  y={90 - revHeight}
                  width="10"
                  height={revHeight}
                  rx="4"
                  fill="#583BE8"
                />

                {/* Expense Bar (Rose) */}
                <rect
                  x={xGroup + 14}
                  y={90 - expHeight}
                  width="10"
                  height={expHeight}
                  rx="4"
                  fill="#FB7185"
                />
              </g>
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="flex items-center justify-around text-[10px] font-bold text-slate-400 pt-1">
          {data.map((pt) => (
            <span key={pt.date}>{pt.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueExpenseChart;
