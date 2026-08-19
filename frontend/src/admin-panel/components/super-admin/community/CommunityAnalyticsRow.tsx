import React, { useState } from 'react';
import { ChevronDown, Users, TrendingUp } from 'lucide-react';
import {
  CommunityActivityDataPoint,
  EngagementFunnelStage,
  ContentTypeDistributionItem,
  TopActiveCommunityItem,
} from '../../../types/communityManagement';

interface CommunityAnalyticsRowProps {
  activityTimeline: CommunityActivityDataPoint[];
  engagementFunnel: EngagementFunnelStage[];
  contentDistribution: ContentTypeDistributionItem[];
  topCommunities: TopActiveCommunityItem[];
  interval: 'Daily' | 'Weekly' | 'Monthly';
  onIntervalChange: (interval: 'Daily' | 'Weekly' | 'Monthly') => void;
  onViewAllCommunities?: () => void;
}

export const CommunityAnalyticsRow: React.FC<CommunityAnalyticsRowProps> = ({
  activityTimeline,
  engagementFunnel,
  contentDistribution,
  topCommunities,
  interval,
  onIntervalChange,
  onViewAllCommunities,
}) => {
  const [isIntervalOpen, setIsIntervalOpen] = useState(false);

  // ── 1. Timeline Chart Paths ──
  const maxMetric = 4000;
  const generateSpline = (key: 'posts' | 'stories' | 'comments' | 'likes' | 'shares') => {
    const pts = activityTimeline.map((d, idx) => {
      const x = (idx / Math.max(activityTimeline.length - 1, 1)) * 100;
      const y = 100 - (d[key] / maxMetric) * 90;
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

  const pathPosts = generateSpline('posts');
  const pathStories = generateSpline('stories');
  const pathComments = generateSpline('comments');
  const pathLikes = generateSpline('likes');
  const pathShares = generateSpline('shares');

  // ── 2. Donut Geometry ──
  const donutSize = 130;
  const donutStroke = 18;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativePercent = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch select-none">
      {/* ── CARD 1: COMMUNITY ACTIVITY TIMELINE (4 Cols) ── */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-xs font-black text-[#0F172A]">Community Activity Timeline</h3>

          {/* Time Filter */}
          <div className="relative">
            <button
              onClick={() => setIsIntervalOpen(!isIntervalOpen)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <span>{interval}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isIntervalOpen && (
              <div className="absolute right-0 top-full mt-1 w-24 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs font-bold text-slate-700">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onIntervalChange(opt);
                      setIsIntervalOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 hover:text-[#6356E5]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 flex-wrap py-1 text-[10px] font-extrabold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6356E5]" />
            <span>Posts</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span>Stories</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span>Comments</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Likes</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            <span>Shares</span>
          </span>
        </div>

        {/* Multi-Line Chart */}
        <div className="relative h-32 w-full pt-2">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* Lines */}
            <path d={pathLikes} fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
            <path d={pathPosts} fill="none" stroke="#6356E5" strokeWidth="2.4" strokeLinecap="round" />
            <path d={pathStories} fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
            <path d={pathComments} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d={pathShares} fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-400 pt-1 border-t border-slate-100">
          {activityTimeline.map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
        </div>
      </div>

      {/* ── CARD 2: ENGAGEMENT FUNNEL (3 Cols) ── */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Engagement Funnel</h3>

        {/* Funnel Layers */}
        <div className="space-y-1.5 py-1">
          {engagementFunnel.map((item, idx) => {
            const widthPct = 100 - idx * 14;
            return (
              <div key={item.stage} className="flex flex-col items-center">
                <div
                  className="rounded-xl py-1.5 px-3 flex items-center justify-between transition-all"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: item.color + '15',
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <span className="text-[11px] font-extrabold" style={{ color: item.color }}>
                    {item.stage}
                  </span>
                  <span className="text-[11px] font-mono font-black text-slate-800">
                    {item.value} {item.percentage !== '100%' && `(${item.percentage})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          27% View-to-Like conversion
        </div>
      </div>

      {/* ── CARD 3: CONTENT TYPE DISTRIBUTION (3 Cols) ── */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Content Type Distribution</h3>

        <div className="flex items-center justify-between gap-3 py-1 my-auto">
          {/* Donut */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {contentDistribution.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * donutCircumference);
                cumulativePercent += item.percentage;

                return (
                  <circle
                    key={item.name}
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={donutStroke}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-1 min-w-0 flex-1">
            {contentDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1.5 text-[10px] truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="font-mono font-black text-slate-800 text-[10px] shrink-0">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Posts & Stories account for 73.9%
        </div>
      </div>

      {/* ── CARD 4: TOP ACTIVE COMMUNITIES (2 Cols / XL: 2 Cols) ── */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Top Active Communities</h3>
          <button
            onClick={onViewAllCommunities}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1">
          {topCommunities.slice(0, 5).map((comm) => (
            <div key={comm.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                  {comm.rank}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] truncate">{comm.name}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
                {comm.memberCount}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-emerald-600 font-bold">
          ↑ Ladakh Explorers +24.2%
        </div>
      </div>
    </div>
  );
};
