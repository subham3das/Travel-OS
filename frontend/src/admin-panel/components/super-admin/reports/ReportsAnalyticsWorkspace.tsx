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
  TopDestinationReportItem,
  AgencyMatrixBubble,
  CategoryPerformanceItem,
  BookingFunnelItem,
} from '../../../types/reportsManagement';

interface ReportsAnalyticsWorkspaceProps {
  revenueTrend: RevenueTrendDataPoint[];
  heatmapMatrix: number[][];
  topDestinations: TopDestinationReportItem[];
  agencyBubbles: AgencyMatrixBubble[];
  categoryPerformance: CategoryPerformanceItem[];
  bookingFunnel?: BookingFunnelItem[];
  onViewAllDestinations?: () => void;
}

export const ReportsAnalyticsWorkspace: React.FC<ReportsAnalyticsWorkspaceProps> = ({
  revenueTrend,
  heatmapMatrix,
  topDestinations,
  agencyBubbles,
  categoryPerformance,
  bookingFunnel = [],
  onViewAllDestinations,
}) => {
  const [revenueInterval, setRevenueInterval] = useState('Daily');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'];

  // ── 1. Revenue Spline generator ──
  const maxRevenue = Math.max(20, ...revenueTrend.map((d) => Math.max(d.thisPeriod, d.lastPeriod)));
  const generateRevenuePath = (key: 'thisPeriod' | 'lastPeriod') => {
    const pts = revenueTrend.map((d, idx) => {
      const x = (idx / Math.max(revenueTrend.length - 1, 1)) * 100;
      const y = 100 - (d[key] / maxRevenue) * 85;
      return { x, y };
    });

    if (pts.length < 2) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
    }, '');
  };

  const funnelSteps = bookingFunnel.length > 0 ? bookingFunnel : [
    { step: 'Registered Users', count: 0, dropoff: '0%' },
    { step: 'Bookings Created', count: 0, dropoff: '0%' },
    { step: 'Completed Trips', count: 0, dropoff: '0%' },
    { step: 'Repeat Travelers', count: 0, dropoff: '0%' },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* ── ROW 1: REVENUE TREND & BOOKING HEATMAP ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Card 1: Revenue Comparison Trend (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <div>
              <h3 className="text-xs font-black text-[#0F172A]">Revenue Trend Comparison</h3>
              <p className="text-[10px] text-slate-400 font-bold">This Period vs. Previous Period</p>
            </div>
            <div className="flex items-center gap-1">
              {['Daily', 'Weekly', 'Monthly'].map((int) => (
                <button
                  key={int}
                  onClick={() => setRevenueInterval(int)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    revenueInterval === int
                      ? 'bg-[#6356E5] text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {int}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-36 w-full pt-2">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="2,2" />

              {/* Last Period - Gray Dashed */}
              {revenueTrend.length > 1 && (
                <path
                  d={generateRevenuePath('lastPeriod')}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.8"
                  strokeDasharray="3,3"
                />
              )}

              {/* This Period - Indigo Gradient Spline */}
              {revenueTrend.length > 1 && (
                <path
                  d={generateRevenuePath('thisPeriod')}
                  fill="none"
                  stroke="#6356E5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 pt-1">
              {revenueTrend.length > 0 ? (
                revenueTrend.map((d) => <span key={d.label}>{d.label}</span>)
              ) : (
                <span className="text-center w-full">No revenue trend data yet</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-2 h-0.5 bg-[#6356E5] inline-block" /> This Period
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-400">
                <span className="w-2 h-0.5 bg-slate-300 inline-block border-b border-dashed" /> Previous Period
              </span>
            </div>
            <span className="font-mono font-bold text-slate-500">Peak: ₹{maxRevenue} L</span>
          </div>
        </div>

        {/* Card 2: 7x7 Booking Heatmap (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Booking Activity Heatmap</h3>
            <span className="text-[10px] font-mono text-slate-400">Day × 4-Hour Slots</span>
          </div>

          <div className="py-1">
            <div className="grid grid-cols-8 gap-1 items-center">
              <div />
              {heatmapHours.slice(0, 7).map((h, i) => (
                <span key={i} className="text-[8px] font-mono font-bold text-slate-400 text-center truncate">
                  {h}
                </span>
              ))}

              {days.map((day, rIdx) => (
                <React.Fragment key={day}>
                  <span className="text-[9px] font-bold text-slate-500">{day}</span>
                  {heatmapMatrix[rIdx]?.slice(0, 7).map((val, cIdx) => {
                    const bg =
                      val > 75
                        ? 'bg-[#6356E5]'
                        : val > 50
                        ? 'bg-[#8B5CF6]'
                        : val > 25
                        ? 'bg-[#C4B5FD]'
                        : val > 0
                        ? 'bg-[#EDE9FE]'
                        : 'bg-slate-100';

                    return (
                      <div
                        key={cIdx}
                        title={`${day} slot ${cIdx + 1}: ${val}% activity`}
                        className={`h-4 rounded-sm ${bg} transition-colors`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-mono text-slate-400">
            <span>Low</span>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-100" />
              <div className="w-2.5 h-2.5 rounded-xs bg-[#EDE9FE]" />
              <div className="w-2.5 h-2.5 rounded-xs bg-[#C4B5FD]" />
              <div className="w-2.5 h-2.5 rounded-xs bg-[#6356E5]" />
            </div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: TOP DESTINATIONS (FULL WIDTH) ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Top Destinations</h3>
          {onViewAllDestinations && (
            <button
              onClick={onViewAllDestinations}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-1.5 py-1">
          {topDestinations.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">No destination bookings recorded yet</div>
          ) : (
            topDestinations.map((dest) => (
              <div key={dest.name} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                    {dest.rank}
                  </span>
                  {dest.thumbnail && (
                    <img
                      src={dest.thumbnail}
                      alt={dest.name}
                      className="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0"
                    />
                  )}
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
            ))
          )}
        </div>

        <div className="pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400 text-right">
          {topDestinations.length > 0
            ? `${topDestinations[0].name} leads destination revenue with ${topDestinations[0].revenue}`
            : 'Destinations are dynamically aggregated from booking records'}
        </div>
      </div>

      {/* ── ROW 3: BOOKING FUNNEL, AGENCY MATRIX, CATEGORY PERFORMANCE ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Card 5: Booking Funnel (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-100/80">Booking Funnel</h3>

          <div className="grid grid-cols-2 gap-1.5 py-1">
            {funnelSteps.map((step) => (
              <div key={step.step} className="p-1.5 rounded-xl bg-slate-50 text-center">
                <span className="text-[8px] text-slate-400 font-bold block">{step.step}</span>
                <span className="text-xs font-black font-mono text-slate-800">{step.count.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-slate-500">{step.dropoff} dropoff</span>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400 text-center">
            {funnelSteps[0]?.count > 0
              ? 'Computed from Users → Bookings → Trips → Repeat Users'
              : 'No traveler conversions recorded yet'}
          </div>
        </div>

        {/* Card 6: Agency Performance Matrix (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Agency Performance Matrix</h3>
            <span className="text-[9px] font-bold text-slate-400">Revenue × Bookings</span>
          </div>

          <div className="relative h-24 w-full pt-1">
            {agencyBubbles.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] text-slate-400">
                No active agency matrix data
              </div>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {agencyBubbles.map((b) => {
                  const cx = Math.min(Math.max((b.bookings / 150) * 80 + 10, 10), 90);
                  const cy = Math.min(Math.max(100 - (b.revenue / 80) * 80 - 10, 10), 90);
                  const r = Math.min(Math.max(b.revenue / 10 + 3, 4), 10);

                  return (
                    <circle
                      key={b.id}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={b.color}
                      opacity={0.7}
                    >
                      <title>{`${b.name}: ${b.bookings} bookings, ₹${b.revenue} L`}</title>
                    </circle>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-mono text-slate-400">
            <span>Low Volume</span>
            <span>High Volume & Revenue</span>
          </div>
        </div>

        {/* Card 7: Category Performance (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Category Breakdown</h3>
            <span className="text-[10px] font-bold text-slate-400">Revenue %</span>
          </div>

          <div className="space-y-1.5 py-1">
            {categoryPerformance.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">No category data available</div>
            ) : (
              categoryPerformance.map((cat) => (
                <div key={cat.category} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-bold truncate">{cat.category}</span>
                    <span className="font-mono font-black text-slate-900">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400 text-center">
            {categoryPerformance.length > 0
              ? 'Platform booking distribution across tour categories'
              : 'No packages booked yet'}
          </div>
        </div>
      </div>
    </div>
  );
};
