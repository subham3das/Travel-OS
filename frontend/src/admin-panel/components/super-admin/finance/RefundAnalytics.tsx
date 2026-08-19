import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, Clock, XCircle, MoreVertical } from 'lucide-react';
import { RefundAnalyticsData } from '../../../types/financeManagement';

interface RefundAnalyticsProps {
  refunds: RefundAnalyticsData;
}

export const RefundAnalytics: React.FC<RefundAnalyticsProps> = ({ refunds }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const metricBoxes = [
    {
      label: 'Total Requests',
      value: refunds.totalRequests.toLocaleString(),
      change: '-4.2%',
      color: 'text-slate-900',
      bg: 'bg-slate-100 text-slate-700',
      icon: RotateCcw,
    },
    {
      label: 'Approved',
      value: refunds.approved.toLocaleString(),
      change: '+6.1%',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 text-emerald-600',
      icon: CheckCircle2,
    },
    {
      label: 'Pending Review',
      value: refunds.pending.toLocaleString(),
      change: '-2.4%',
      color: 'text-amber-700',
      bg: 'bg-amber-50 text-amber-600',
      icon: Clock,
    },
    {
      label: 'Rejected',
      value: refunds.rejected.toLocaleString(),
      change: '-8.5%',
      color: 'text-rose-700',
      bg: 'bg-rose-50 text-rose-600',
      icon: XCircle,
    },
  ];

  // SVG dimensions for trend chart
  const width = 380;
  const height = 120;
  const padding = 20;

  const points = refunds.trends;
  const maxReq = Math.max(...points.map((p) => p.requests), 400);

  const getX = (index: number) => padding + (index * (width - padding * 2)) / (points.length - 1);
  const getYReq = (val: number) => height - padding - (val / maxReq) * (height - padding * 2);
  const getYApp = (val: number) => height - padding - (val / maxReq) * (height - padding * 2);

  const reqPoints = points.map((p, i) => `${getX(i)},${getYReq(p.requests)}`);
  const appPoints = points.map((p, i) => `${getX(i)},${getYApp(p.approved)}`);

  const reqPath = `M ${reqPoints.join(' L ')}`;
  const appPath = `M ${appPoints.join(' L ')}`;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Refund Analytics</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
              Avg Resolution 4.2h
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Dispute resolution and processing volume
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Metric Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4">
        {metricBoxes.map((box) => {
          const Icon = box.icon;
          return (
            <div
              key={box.label}
              className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${box.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 font-mono">
                  {box.change}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                {box.label}
              </span>
              <span className={`text-base font-black font-mono block ${box.color}`}>
                {box.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Trend Dual-Line Chart */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            6-Month Request vs Approval Trend
          </span>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-slate-600">Requests</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Approved</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
            {/* Grid horizontal lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F1F5F9" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F1F5F9" strokeDasharray="3 3" />

            {/* Path: Total Requests (Rose) */}
            <path
              d={reqPath}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Path: Approved Requests (Emerald) */}
            <path
              d={appPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Nodes */}
            {points.map((p, i) => (
              <g key={p.month}>
                <circle
                  cx={getX(i)}
                  cy={getYReq(p.requests)}
                  r={hoveredPoint === i ? 4 : 2.5}
                  className="fill-rose-500 stroke-white stroke-2 cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <circle
                  cx={getX(i)}
                  cy={getYApp(p.approved)}
                  r={hoveredPoint === i ? 4 : 2.5}
                  className="fill-emerald-500 stroke-white stroke-2 cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Month labels */}
          <div className="flex justify-between px-3 text-[10px] font-bold text-slate-400 font-mono mt-1">
            {points.map((p) => (
              <span key={p.month}>{p.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
