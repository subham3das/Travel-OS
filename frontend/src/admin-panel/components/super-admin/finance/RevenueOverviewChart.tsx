import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RevenueChartPoint } from '../../../types/financeManagement';

interface RevenueOverviewChartProps {
  data: RevenueChartPoint[];
  timeframe: 'Daily' | 'Weekly' | 'Monthly';
  onTimeframeChange: (tf: 'Daily' | 'Weekly' | 'Monthly') => void;
}

export const RevenueOverviewChart: React.FC<RevenueOverviewChartProps> = ({
  data,
  timeframe,
  onTimeframeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'Revenue' | 'GMV' | 'Profit'>('Revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(5); // default Jun 6 active like reference

  // Calculate chart metrics
  const values = data.map((d) =>
    activeTab === 'Revenue' ? d.revenue : activeTab === 'GMV' ? d.gmv : d.profit
  );
  const maxValue = Math.max(...values, 1) * 1.15;

  const points = data.map((d, idx) => {
    const val = activeTab === 'Revenue' ? d.revenue : activeTab === 'GMV' ? d.gmv : d.profit;
    const x = (idx / Math.max(data.length - 1, 1)) * 100;
    const y = 100 - (val / maxValue) * 100;
    return { x, y, data: d, val };
  });

  // Build SVG path
  const svgPath = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${svgPath} L 100 100 L 0 100 Z`;

  const hoveredPoint = hoveredIndex !== null && hoveredIndex < points.length ? points[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none flex flex-col justify-between h-full w-full min-w-0 overflow-hidden">
      {/* Header with Title + Segmented Tabs + Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
        <h3 className="text-sm font-black text-[#0F172A] truncate">Revenue Overview</h3>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Segmented Tabs */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl text-[11px] font-extrabold shrink-0">
            {(['Revenue', 'GMV', 'Profit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-[#6356E5] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 pr-6 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative h-48 sm:h-52 w-full pt-2 min-w-0">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none">
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹50L</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹40L</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹30L</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹20L</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹10L</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between pb-0.5">
            <span>₹0</span>
          </div>
        </div>

        {/* SVG Chart Line + Area */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full absolute inset-0 overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6356E5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6356E5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gradient Fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Stroke Path */}
          <path
            d={svgPath}
            fill="none"
            stroke="#6356E5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Dots */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === idx ? 4.5 : 3}
              className={`transition-all cursor-pointer ${
                hoveredIndex === idx
                  ? 'fill-[#6356E5] stroke-white stroke-2'
                  : 'fill-[#6356E5]'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
            />
          ))}
        </svg>

        {/* Floating Tooltip matching image */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${Math.min(Math.max(hoveredPoint.x, 15), 80)}%`,
              top: `${Math.max(hoveredPoint.y - 35, 10)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-[#0F172A] text-white rounded-xl px-3 py-1.5 shadow-xl border border-slate-700/80 text-[10px] font-bold space-y-0.5 whitespace-nowrap">
              <p className="text-slate-300 font-semibold">{hoveredPoint.data.date}, 2024</p>
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <span className="w-2 h-2 rounded-full bg-[#6356E5]" />
                <span>
                  {activeTab}:{' '}
                  {activeTab === 'Revenue'
                    ? hoveredPoint.data.formattedRevenue
                    : activeTab === 'GMV'
                    ? hoveredPoint.data.formattedGmv
                    : hoveredPoint.data.formattedProfit}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100 min-w-0">
        {data.map((d, idx) => (
          <span
            key={idx}
            className={`cursor-pointer transition-colors truncate px-0.5 ${
              hoveredIndex === idx ? 'text-[#6356E5] font-black' : 'hover:text-slate-700'
            }`}
            onMouseEnter={() => setHoveredIndex(idx)}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
