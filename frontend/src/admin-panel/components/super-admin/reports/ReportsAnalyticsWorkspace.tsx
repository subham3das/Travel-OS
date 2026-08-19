import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Users,
  Activity,
  Layers,
} from 'lucide-react';
import {
  RevenueTrendDataPoint,
  GeographicRegionData,
  TopDestinationReportItem,
  AgencyMatrixBubble,
  CategoryPerformanceItem,
} from '../../../types/reportsManagement';

interface ReportsAnalyticsWorkspaceProps {
  revenueTrend: RevenueTrendDataPoint[];
  heatmapMatrix: number[][];
  geographicData: GeographicRegionData[];
  topDestinations: TopDestinationReportItem[];
  agencyBubbles: AgencyMatrixBubble[];
  categoryPerformance: CategoryPerformanceItem[];
  onViewAllDestinations?: () => void;
}

export const ReportsAnalyticsWorkspace: React.FC<ReportsAnalyticsWorkspaceProps> = ({
  revenueTrend,
  heatmapMatrix,
  geographicData,
  topDestinations,
  agencyBubbles,
  categoryPerformance,
  onViewAllDestinations,
}) => {
  const [revenueInterval, setRevenueInterval] = useState('Daily');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'];

  // ── 1. Revenue Spline generator ──
  const maxRevenue = 20;
  const generateRevenuePath = (key: 'thisPeriod' | 'lastPeriod') => {
    const pts = revenueTrend.map((d, idx) => {
      const x = (idx / Math.max(revenueTrend.length - 1, 1)) * 100;
      const y = 100 - (d[key] / maxRevenue) * 85;
      return { x, y };
    });

    return pts.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const pathThis = generateRevenuePath('thisPeriod');
  const pathLast = generateRevenuePath('lastPeriod');

  return (
    <div className="space-y-4 select-none">
      {/* ── ROW 1: REVENUE TREND & BOOKING HEATMAP ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Card 1: Revenue Trend (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-black text-[#0F172A]">Revenue Trend</h3>
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer">
              <span>{revenueInterval}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-extrabold text-slate-500 py-1">
            <span className="flex items-center gap-1 text-[#6356E5]">
              <span className="w-2 h-2 rounded-full bg-[#6356E5]" />
              <span>This Period</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full border border-purple-300" />
              <span>Last Period</span>
            </span>
          </div>

          <div className="relative h-28 w-full pt-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <path d={pathLast} fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
              <path d={pathThis} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
              {revenueTrend.map((d, i) => {
                const cx = (i / (revenueTrend.length - 1)) * 100;
                const cy = 100 - (d.thisPeriod / maxRevenue) * 85;
                return <circle key={i} cx={cx} cy={cy} r="3" fill="#6356E5" />;
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            {revenueTrend.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Card 2: Booking Heatmap (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-black text-[#0F172A]">Booking Heatmap</h3>
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              <span>Last 30 Days</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-1 py-1">
            {days.map((day, dIdx) => (
              <div key={day} className="flex items-center gap-1">
                <span className="w-5 text-[8px] font-mono font-bold text-slate-400">{day}</span>
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {heatmapMatrix[dIdx].map((val, hIdx) => (
                    <div
                      key={hIdx}
                      className="h-2.5 rounded-sm"
                      style={{
                        backgroundColor: `rgba(99, 86, 229, ${val})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-between pl-6 text-[8px] font-mono text-slate-400 pt-0.5">
              <span>12 AM</span>
              <span>8 AM</span>
              <span>4 PM</span>
              <span>12 AM</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400">
            <span>Low</span>
            <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-purple-100 to-[#6356E5]" />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: GEOGRAPHIC PERFORMANCE & TOP DESTINATIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Card 3: Geographic Performance (6 Cols) */}
        <div className="md:col-span-6 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Geographic Performance</h3>
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              <span>All Regions</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center py-2">
            {/* SVG India Map Graphic */}
            <div className="col-span-5 flex items-center justify-center p-1">
              <svg viewBox="0 0 100 120" className="w-full h-auto max-h-32 text-purple-300">
                <path
                  d="M45,5 Q55,8 60,18 Q62,28 75,32 Q85,38 90,50 Q85,60 70,68 Q65,80 55,95 Q50,110 48,118 Q45,110 40,95 Q30,80 25,68 Q15,60 10,50 Q20,38 30,32 Q38,28 40,18 Z"
                  fill="#EDE9FE"
                  stroke="#6356E5"
                  strokeWidth="1.5"
                />
                <circle cx="35" cy="65" r="4" fill="#6356E5" />
                <circle cx="45" cy="85" r="3.5" fill="#3B82F6" />
                <circle cx="50" cy="98" r="3" fill="#06B6D4" />
                <circle cx="48" cy="38" r="2.5" fill="#10B981" />
                <circle cx="32" cy="48" r="2.5" fill="#F97316" />
              </svg>
            </div>

            {/* State Ranking List */}
            <div className="col-span-7 space-y-1 text-xs">
              {geographicData.map((reg) => (
                <div key={reg.state} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: reg.color }} />
                    <span className="truncate">{reg.state}</span>
                  </span>
                  <span className="font-mono font-black text-slate-800 shrink-0">{reg.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-mono text-slate-400">
            <span>0%</span>
            <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-purple-100 to-[#6356E5]" />
            <span>20%+</span>
          </div>
        </div>

        {/* Card 4: Top Destinations (6 Cols) */}
        <div className="md:col-span-6 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Top Destinations</h3>
            <button
              onClick={onViewAllDestinations}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-1.5 py-1">
            {topDestinations.map((dest) => (
              <div key={dest.name} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                    {dest.rank}
                  </span>
                  <img
                    src={dest.thumbnail}
                    alt={dest.name}
                    className="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0"
                  />
                  <span className="font-bold text-slate-800 text-[11px] truncate">{dest.name}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono shrink-0">
                  <span className="text-slate-500 font-bold">{dest.bookings}</span>
                  <span className="font-black text-slate-800">{dest.revenue}</span>
                  <span className="font-black text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    <span>{dest.growth}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400 text-right">
            Ladakh generated ₹2.48 Cr with +22.4% MoM
          </div>
        </div>
      </div>

      {/* ── ROW 3: BOOKING FUNNEL, AGENCY MATRIX, CATEGORY PERFORMANCE ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Card 5: Booking Funnel (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-100/80">Booking Funnel</h3>

          <div className="grid grid-cols-2 gap-1.5 py-1">
            <div className="p-1.5 rounded-xl bg-slate-50 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">New Users</span>
              <span className="text-xs font-black font-mono text-slate-800">68,542</span>
              <span className="text-[8px] font-bold text-emerald-600">↑ 14.2%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">Returning Users</span>
              <span className="text-xs font-black font-mono text-slate-800">56,314</span>
              <span className="text-[8px] font-bold text-emerald-600">↑ 11.7%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">Retention Rate</span>
              <span className="text-xs font-black font-mono text-slate-800">42.6%</span>
              <span className="text-[8px] font-bold text-emerald-600">↑ 6.3%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">Avg. Session Time</span>
              <span className="text-xs font-black font-mono text-slate-800">08m 34s</span>
              <span className="text-[8px] font-bold text-emerald-600">↑ 12.8%</span>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400 text-center">
            User retention is healthy at 42.6%
          </div>
        </div>

        {/* Card 6: Agency Performance Matrix (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Agency Performance Matrix</h3>
            <button className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">
              <span>Revenue</span>
              <ChevronDown className="w-2 h-2" />
            </button>
          </div>

          {/* Scatter Chart */}
          <div className="relative h-24 w-full pt-1">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#F1F5F9" strokeWidth="1" />

              {/* Bubbles */}
              {agencyBubbles.map((b) => {
                const cx = (b.bookings / 6) * 90 + 5;
                const cy = 50 - (b.growth / 40) * 40;
                const r = b.revenue * 3 + 2;
                return (
                  <circle
                    key={b.id}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={b.color}
                    opacity="0.8"
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />Top</span>
            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />Potential</span>
            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />Attention</span>
            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Low</span>
          </div>
        </div>

        {/* Card 7: Category Performance (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Category Performance</h3>
            <button className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">
              <span>Revenue</span>
              <ChevronDown className="w-2 h-2" />
            </button>
          </div>

          <div className="space-y-1.5 py-1">
            {categoryPerformance.slice(0, 5).map((cat) => (
              <div key={cat.category} className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-bold text-slate-700">
                  <span className="truncate">{cat.category}</span>
                  <span className="font-mono">{cat.revenue} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.percentage * 3}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
