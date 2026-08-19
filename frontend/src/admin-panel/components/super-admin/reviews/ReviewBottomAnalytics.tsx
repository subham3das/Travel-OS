import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  RecentModerationActivityItem,
  ReportedAgencyItem,
  ReportedTravelerItem,
} from '../../../types/reviewManagement';

interface ReviewBottomAnalyticsProps {
  recentActivity: RecentModerationActivityItem[];
  reportedAgencies: ReportedAgencyItem[];
  reportedTravelers: ReportedTravelerItem[];
  onViewAllActivity?: () => void;
  onViewAllAgencies?: () => void;
  onViewAllTravelers?: () => void;
}

export const ReviewBottomAnalytics: React.FC<ReviewBottomAnalyticsProps> = ({
  recentActivity,
  reportedAgencies,
  reportedTravelers,
  onViewAllActivity,
  onViewAllAgencies,
  onViewAllTravelers,
}) => {
  // Platform Rating Trend spline path data
  const trendPoints = [
    { x: 0, y: 75, label: 'May 13', val: 4.2 },
    { x: 25, y: 55, label: 'May 20', val: 4.4 },
    { x: 50, y: 68, label: 'May 27', val: 4.3 },
    { x: 75, y: 35, label: 'Jun 3', val: 4.6 },
    { x: 100, y: 40, label: 'Jun 10', val: 4.6 },
  ];

  const trendSvgPath = trendPoints.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const trendAreaPath = `${trendSvgPath} L 100 100 L 0 100 Z`;

  const getActivityIcon = (type: RecentModerationActivityItem['type']) => {
    switch (type) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'removed':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'warned_user':
      case 'warned_agency':
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: RECENT MODERATION ACTIVITY ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Recent Moderation Activity</h3>
          <button
            onClick={onViewAllActivity}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-3 py-2">
          {recentActivity.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-2 min-w-0">
                <div className="mt-0.5">{getActivityIcon(item.type)}</div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] leading-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">by {item.actor}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.timeAgo}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Real-time platform action log
        </div>
      </div>

      {/* ── CARD 2: PLATFORM RATING TREND ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Platform Rating Trend</h3>
          <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer">
            <span>This Month</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
        </div>

        <div className="py-2 space-y-1">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#0F172A] font-mono">4.6 ★</span>
              <span className="text-[11px] font-bold text-slate-400">Average Rating</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" />
              <span>0.3 vs last month</span>
            </span>
          </div>

          {/* Mini Wave Area Chart */}
          <div className="relative h-20 w-full pt-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="ratingTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={trendAreaPath} fill="url(#ratingTrendGrad)" />
              <path d={trendSvgPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-400 pt-1">
            <span>May 13</span>
            <span>May 20</span>
            <span>May 27</span>
            <span>Jun 3</span>
            <span>Jun 10</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Historical 30-day moving average
        </div>
      </div>

      {/* ── CARD 3: MOST REPORTED AGENCIES ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Most Reported Agencies</h3>
          <button
            onClick={onViewAllAgencies}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1.5">
          {reportedAgencies.slice(0, 5).map((agency, idx) => (
            <div key={agency.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono font-black text-slate-400 w-3.5">
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-800 text-[11px] truncate">
                  {agency.agencyName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 font-mono">
                {agency.reportsCount} Reports
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Flagged for compliance inspection
        </div>
      </div>

      {/* ── CARD 4: MOST REPORTED TRAVELERS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Most Reported Travelers</h3>
          <button
            onClick={onViewAllTravelers}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1.5">
          {reportedTravelers.slice(0, 5).map((traveler, idx) => (
            <div key={traveler.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono font-black text-slate-400 w-3.5">
                  {idx + 1}
                </span>
                <img
                  src={traveler.avatar}
                  alt={traveler.travelerName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <span className="font-bold text-slate-800 text-[11px] truncate">
                  {traveler.travelerName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 font-mono">
                {traveler.reportsCount} Reports
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Accounts flagged with warning strikes
        </div>
      </div>
    </div>
  );
};
