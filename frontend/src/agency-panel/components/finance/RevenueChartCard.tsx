import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { RevenueTrendPoint } from '../../data/finance';

interface RevenueChartCardProps {
  trendData: RevenueTrendPoint[];
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({ trendData }) => {
  const [activeFilter, setActiveFilter] = useState('30D');
  const [hoveredPoint, setHoveredPoint] = useState<RevenueTrendPoint | null>({
    date: '17 May',
    revenue: 245800,
    bookings: 12,
    netProfit: 196000,
    formattedRevenue: '₹2,45,800',
  });

  const filters = ['7D', '30D', '3M', '6M', '1Y'];

  // SVG Chart Dimensions
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = 400000;
  const pointsCount = trendData.length;

  const points = trendData.map((pt, i) => {
    const x = paddingX + (i / (pointsCount - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (pt.revenue / maxVal) * (height - 2 * paddingY);
    return { x, y, pt };
  });

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#583BE8]" />
          <span>Revenue Trend</span>
        </h3>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[#583BE8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="relative pt-2">
        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-slate-800 z-10 text-center">
            <span className="block text-purple-300 font-black">{hoveredPoint.formattedRevenue}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{hoveredPoint.date}</span>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Y-Axis Grid Lines & Labels */}
          {[0, 100000, 200000, 300000, 400000].map((val) => {
            const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
            const label = val === 0 ? '₹0' : `₹${val / 100000}L`;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  className="text-[10px] fill-slate-400 font-semibold text-right"
                  textAnchor="end"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Smooth Curve Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#583BE8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#583BE8"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="hover:r-7 transition-all cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p.pt)}
            />
          ))}
        </svg>

        {/* X-Axis Date Labels */}
        <div className="flex justify-between items-center px-6 text-[10px] font-bold text-slate-400 pt-1">
          {trendData.map((pt) => (
            <span key={pt.date}>{pt.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChartCard;
