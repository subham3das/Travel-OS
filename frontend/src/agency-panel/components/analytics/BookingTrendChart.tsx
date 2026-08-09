import React from 'react';
import { BookingTrendDataPoint } from '../../data/analytics';

interface BookingTrendChartProps {
  data: BookingTrendDataPoint[];
}

export const BookingTrendChart: React.FC<BookingTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Bookings Over Time
        </span>

        <select className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer">
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
        </select>
      </div>

      {/* SVG Bar Chart */}
      <div className="pt-2">
        <svg viewBox="0 0 350 100" className="w-full h-32 overflow-visible">
          {/* Y Grid Lines */}
          <line x1="0" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="350" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="350" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

          {/* Y Axis Labels */}
          <text x="0" y="22" fill="#94A3B8" fontSize="8" fontWeight="600">80</text>
          <text x="0" y="52" fill="#94A3B8" fontSize="8" fontWeight="600">40</text>
          <text x="0" y="82" fill="#94A3B8" fontSize="8" fontWeight="600">0</text>

          {data.map((pt, idx) => {
            const x = 30 + idx * 70;
            const height = (pt.bookings / 80) * 70;

            return (
              <g key={pt.date}>
                <rect
                  x={x}
                  y={90 - height}
                  width="18"
                  height={height}
                  rx="6"
                  fill="#583BE8"
                />
              </g>
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="flex items-center justify-around text-[10px] font-bold text-slate-400 pt-1 pl-4">
          {data.map((pt) => (
            <span key={pt.date}>{pt.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingTrendChart;
