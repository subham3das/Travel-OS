import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RevenueData } from '../../data/dashboardInsights';

interface RevenueChartCardProps {
  data: RevenueData;
  selectedRange: string;
  onRangeChange: (range: 'Today' | 'This Week' | 'This Month' | 'This Year') => void;
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  data,
  selectedRange,
  onRangeChange,
}) => {
  const points = data.chartPoints && data.chartPoints.length >= 2
    ? data.chartPoints
    : [20, 35, 45, 60, 80];

  const labels = data.chartLabels && data.chartLabels.length > 0
    ? data.chartLabels
    : ['1st', '8th', '15th', '22nd', 'End'];

  // Map values to SVG coordinates (width: 300, height: 100, chart area: y from 20 to 80, x from 30 to 270)
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const valRange = maxVal === minVal ? 1 : maxVal - minVal;

  const svgCoords = points.map((val, idx) => {
    const x = 30 + (idx / (points.length - 1)) * 240;
    const y = 80 - ((val - minVal) / valRange) * 55;
    return { x: Math.round(x), y: Math.round(y) };
  });

  const pathD = svgCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = svgCoords[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} 90 L ${svgCoords[0].x} 90 Z`;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      {/* Header: Title & Time Range Dropdown */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Revenue {selectedRange}
        </h4>
        <select
          value={selectedRange}
          onChange={(e) =>
            onRangeChange(e.target.value as 'Today' | 'This Week' | 'This Month' | 'This Year')
          }
          className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#583BE8] cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Today">Today</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Revenue Amount & Growth Badge */}
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          {data.revenueAmount}
        </h3>
        <p
          className={`text-xs font-bold flex items-center gap-1 ${
            data.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {data.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{data.growthPct} vs last {selectedRange.toLowerCase()}</span>
        </p>
      </div>

      {/* Lightweight SVG Mini Line Chart */}
      <div className="pt-2 relative">
        <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#583BE8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#583BE8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#purpleGradient)" />

          {/* Smooth Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#583BE8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dynamic Data Dots */}
          {svgCoords.map((coord, i) => (
            <circle
              key={i}
              cx={coord.x}
              cy={coord.y}
              r={i === svgCoords.length - 1 ? 5 : 4}
              fill="#583BE8"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* X Axis Labels */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-1 px-1">
          {labels.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChartCard;
