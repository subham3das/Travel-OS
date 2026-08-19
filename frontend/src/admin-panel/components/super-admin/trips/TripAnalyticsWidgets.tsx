import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
  MapPin,
  Clock,
  ArrowUpRight,
  Star,
  MoreVertical,
  Activity,
} from 'lucide-react';
import {
  TripActivityChartPoint,
  TripStatusBreakdownItem,
  DestinationTripItem,
  TopAgencyTripItem,
  MonthlyTripSummaryData,
  TripAlertItem,
} from '../../../types/tripManagement';

interface TripAnalyticsWidgetsProps {
  activityData: TripActivityChartPoint[];
  statusBreakdown: TripStatusBreakdownItem[];
  destinationTrips: DestinationTripItem[];
  topAgencies: TopAgencyTripItem[];
  monthlySummary: MonthlyTripSummaryData;
  tripAlerts: TripAlertItem[];
}

export const TripAnalyticsWidgets: React.FC<TripAnalyticsWidgetsProps> = ({
  activityData,
  statusBreakdown,
  destinationTrips,
  topAgencies,
  monthlySummary,
  tripAlerts,
}) => {
  const [activeActivityTab, setActiveActivityTab] = useState<'Trips' | 'Travelers' | 'Revenue'>('Trips');

  // Activity SVG Path
  const values = activityData.map((d) =>
    activeActivityTab === 'Trips' ? d.trips : activeActivityTab === 'Travelers' ? d.travelers : d.revenue / 100000
  );
  const maxValue = Math.max(...values, 10) * 1.15;
  const points = activityData.map((d, idx) => {
    const val = activeActivityTab === 'Trips' ? d.trips : activeActivityTab === 'Travelers' ? d.travelers : d.revenue / 100000;
    const x = (idx / Math.max(activityData.length - 1, 1)) * 100;
    const y = 100 - (val / maxValue) * 100;
    return { x, y, data: d, val };
  });

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

  // Donut circumference
  const donutSize = 160;
  const strokeWidth = 20;
  const radius = (donutSize - strokeWidth) / 2;
  const center = donutSize / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="space-y-5 select-none">
      {/* ── ROW 1: ACTIVITY CHART + STATUS DONUT + DESTINATION BARS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch">
        {/* 1. Trip Activity Movement */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full md:col-span-2 2xl:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6356E5]" />
              <h3 className="text-sm font-black text-[#0F172A]">Trip Activity Movement</h3>
            </div>

            <div className="flex items-center p-1 bg-slate-100/80 rounded-xl text-[11px] font-extrabold">
              {(['Trips', 'Travelers', 'Revenue'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveActivityTab(tab)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeActivityTab === tab
                      ? 'bg-white text-[#6356E5] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-44 w-full pt-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="tripActGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6356E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6356E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#tripActGrad)" />
              <path d={svgPath} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 pt-2 border-t border-slate-100">
            {activityData.map((d, idx) => (
              <span key={idx}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* 2. Trip Status Breakdown Donut */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <h3 className="text-sm font-black text-[#0F172A]">Trip Status Breakdown</h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Platform Split</span>
          </div>

          <div className="flex items-center justify-center py-2 relative">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {statusBreakdown.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                cumulativePercent += item.percentage;

                return (
                  <circle
                    key={item.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active + Done</span>
              <span className="text-lg font-black text-[#0F172A] font-mono">4,286</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-semibold text-[11px] truncate">{item.name}</span>
                </div>
                <span className="font-mono font-black text-slate-800 text-[11px]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Trips by Destination */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <h3 className="text-sm font-black text-[#0F172A]">Trips by Destination</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Top 6
            </span>
          </div>

          <div className="space-y-2 py-2">
            {destinationTrips.map((dest) => (
              <div key={dest.destination} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#6356E5]" />
                    <span>{dest.destination}</span>
                  </span>
                  <span className="font-mono text-slate-500">{dest.tripsCount} trips ({dest.travelersCount} pax)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6356E5] to-[#8B7FF8]"
                    style={{ width: `${dest.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Ladakh leads with 840 completed trips</span>
            <span className="text-[#6356E5] font-black cursor-pointer hover:underline">All Regions</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: TOP AGENCIES + MONTHLY SUMMARY + ALERTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch">
        {/* 1. Top Performing Agencies */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between md:col-span-2 2xl:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-[#0F172A]">Top Operating Agencies</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">By Trip Volume</span>
          </div>

          <div className="divide-y divide-slate-100/80 py-1">
            {topAgencies.map((agency, idx) => (
              <div key={agency.id} className="flex items-center justify-between py-2.5 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <img src={agency.agencyLogo} alt={agency.agencyName} className="w-6 h-6 rounded-lg object-cover border border-slate-200" />
                  <div className="min-w-0">
                    <span className="font-bold text-[#0F172A] block truncate">{agency.agencyName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{agency.trips} trips • {agency.travelers} pax</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-[#6356E5] block">{agency.revenue}</span>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono">↑{agency.growth}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-[#6356E5] text-right cursor-pointer hover:underline">
            View All Operating Partners →
          </div>
        </div>

        {/* 2. Monthly Trip Summary */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <h3 className="text-sm font-black text-[#0F172A]">Monthly Trip Summary</h3>
            <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              June 2024
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-2">
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Trips Started</span>
              <span className="text-base font-black text-[#0F172A] font-mono block mt-0.5">{monthlySummary.tripsStarted}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Trips Completed</span>
              <span className="text-base font-black text-emerald-600 font-mono block mt-0.5">{monthlySummary.tripsCompleted}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Avg Duration</span>
              <span className="text-base font-black text-[#0F172A] font-mono block mt-0.5">{monthlySummary.avgDuration}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Avg Occupancy</span>
              <span className="text-base font-black text-[#6356E5] font-mono block mt-0.5">{monthlySummary.occupancy}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Average Rating</span>
              <span className="text-base font-black text-amber-600 font-mono block mt-0.5">{monthlySummary.avgRating}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Success Rate</span>
              <span className="text-base font-black text-emerald-600 font-mono block mt-0.5">{monthlySummary.tripSuccessRate}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
            Reconciled across 426 live vehicles in real time
          </div>
        </div>

        {/* 3. Operational Trip Alerts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-black text-[#0F172A]">Live Trip Alerts</h3>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              4 Active
            </span>
          </div>

          <div className="space-y-2 py-2">
            {tripAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded-2xl border bg-slate-50/70 border-slate-100 space-y-0.5"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#0F172A] truncate">{alert.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-snug">{alert.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-[#6356E5] text-right cursor-pointer hover:underline">
            Open Emergency Incident Desk →
          </div>
        </div>
      </div>
    </div>
  );
};
