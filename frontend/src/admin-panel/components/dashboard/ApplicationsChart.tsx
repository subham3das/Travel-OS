import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MOCK_CHART_7_DAYS, MOCK_CHART_30_DAYS, ChartDataPoint } from '../../data/dashboard';

export const ApplicationsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const data: ChartDataPoint[] = timeRange === '7days' ? MOCK_CHART_7_DAYS : MOCK_CHART_30_DAYS;

  const maxVal = 80;
  const height = 180;
  const width = 500;

  // Calculate SVG points for smooth curve
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (d.applications / maxVal) * height;
    return { x, y, value: d.applications, label: d.date };
  });

  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Applications Overview</h3>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#583BE8] cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full pt-4">
        {/* Y-Axis Grid Lines & Labels */}
        <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        {/* SVG Container */}
        <div className="ml-8 pr-2">
          <svg className="w-full h-44 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#583BE8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#583BE8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={height * ratio}
                x2={width}
                y2={height * ratio}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Gradient Fill */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={areaD}
              fill="url(#purpleGradient)"
            />

            {/* Line Path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              d={pathD}
              fill="none"
              stroke="#583BE8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Glowing Dots */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#583BE8"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-transform group-hover/dot:scale-150"
                />
                {/* Tooltip on Hover */}
                <title>{`${p.label}: ${p.value} applications`}</title>
              </g>
            ))}
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-3 px-1">
            {data.map((d, i) => (
              <span key={i}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationsChart;
