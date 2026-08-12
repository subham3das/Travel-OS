import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartDataPoint } from '../../types/dashboard';

interface CustomAreaChartProps {
  data: ChartDataPoint[];
  color: 'purple' | 'blue' | 'emerald' | 'orange';
  yAxisPrefix?: string;
  yAxisSuffix?: string;
}

export const CustomAreaChart: React.FC<CustomAreaChartProps> = ({
  data,
  color,
  yAxisPrefix = '',
  yAxisSuffix = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Colors mapping
  const colorMap = {
    purple: {
      stroke: '#6356E5',
      fillStart: 'rgba(99, 86, 229, 0.35)',
      fillStop: 'rgba(99, 86, 229, 0.01)',
      dotBg: '#6356E5',
    },
    blue: {
      stroke: '#2563EB',
      fillStart: 'rgba(37, 99, 235, 0.35)',
      fillStop: 'rgba(37, 99, 235, 0.01)',
      dotBg: '#2563EB',
    },
    emerald: {
      stroke: '#10B981',
      fillStart: 'rgba(16, 185, 129, 0.35)',
      fillStop: 'rgba(16, 185, 129, 0.01)',
      dotBg: '#10B981',
    },
    orange: {
      stroke: '#F97316',
      fillStart: 'rgba(249, 115, 22, 0.35)',
      fillStop: 'rgba(249, 115, 22, 0.01)',
      dotBg: '#F97316',
    },
  };

  const selectedColor = colorMap[color];
  const gradientId = `chart-gradient-${color}-${Math.random().toString(36).substr(2, 9)}`;

  const minVal = 0;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;

  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Calculate smooth Bezier Curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const controlX = (curr.x + next.x) / 2;
    pathD += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full h-48 select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={selectedColor.fillStart} />
            <stop offset="100%" stopColor={selectedColor.fillStop} />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = paddingY + pct * chartHeight;
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          );
        })}

        {/* Gradient Fill Area */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          d={areaD}
          fill={`url(#${gradientId})`}
        />

        {/* Smooth Curved Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          d={pathD}
          fill="none"
          stroke={selectedColor.stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data Nodes & Interactive Hover Triggers */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? '6' : '4'}
              fill="#FFFFFF"
              stroke={selectedColor.stroke}
              strokeWidth="2.5"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* X-axis date label for selected ticks */}
            {(idx === 0 || idx === Math.floor(data.length / 4) || idx === Math.floor(data.length / 2) || idx === Math.floor((3 * data.length) / 4) || idx === data.length - 1) && (
              <text
                x={pt.x}
                y={height - 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#94A3B8"
              >
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Interactive Tooltip Overlay */}
      {hoveredIdx !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 35}%`,
          }}
          className="absolute -translate-x-1/2 bg-slate-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-lg pointer-events-none z-20 whitespace-nowrap"
        >
          {points[hoveredIdx].label}: {yAxisPrefix}{points[hoveredIdx].value}{yAxisSuffix}
        </motion.div>
      )}
    </div>
  );
};
