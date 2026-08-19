import React from 'react';
import {
  ChevronDown,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  TrendingDestinationItem,
  CommunityHealthScoreData,
  TopCreatorItem,
} from '../../../types/communityManagement';

interface CommunityBottomWidgetsProps {
  trendingDestinations: TrendingDestinationItem[];
  healthScore: CommunityHealthScoreData;
  topCreators: TopCreatorItem[];
  onViewAllCreators?: () => void;
}

export const CommunityBottomWidgets: React.FC<CommunityBottomWidgetsProps> = ({
  trendingDestinations,
  healthScore,
  topCreators,
  onViewAllCreators,
}) => {
  // Gauge geometry for 86 score
  const gaugeSize = 130;
  const strokeWidth = 14;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore.overallScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch select-none">
      {/* ── WIDGET 1: TRENDING DESTINATIONS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Trending Destinations</h3>
          <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer">
            <span>This Month</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 relative z-10">
          {/* List */}
          <div className="space-y-2">
            {trendingDestinations.map((dest) => (
              <div key={dest.name} className="flex items-center gap-2 text-xs font-bold">
                <span
                  className="w-5 h-5 rounded-full text-white text-[10px] font-mono flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: dest.color }}
                >
                  {dest.rank}
                </span>
                <span className="text-slate-800 truncate">{dest.name}</span>
              </div>
            ))}
          </div>

          {/* Dotted Map Graphic */}
          <div className="flex items-center justify-center opacity-70">
            <svg viewBox="0 0 100 80" className="w-full h-auto text-blue-300 fill-current">
              <circle cx="20" cy="20" r="3" />
              <circle cx="30" cy="25" r="3" />
              <circle cx="45" cy="18" r="4" fill="#6356E5" />
              <circle cx="60" cy="30" r="3" />
              <circle cx="35" cy="40" r="4" fill="#3B82F6" />
              <circle cx="50" cy="48" r="4" fill="#06B6D4" />
              <circle cx="40" cy="65" r="4" fill="#10B981" />
              <circle cx="75" cy="45" r="3" />
              <circle cx="85" cy="35" r="3" />
              <circle cx="70" cy="60" r="3" />
            </svg>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          Ladakh ranks #1 with 4.8K posts this week
        </div>
      </div>

      {/* ── WIDGET 2: COMMUNITY HEALTH SCORE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A] pb-2 border-b border-slate-100/80">
          Community Health Score
        </h3>

        <div className="flex items-center justify-between gap-3 py-2">
          {/* Circular Gauge */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={gaugeSize} height={gaugeSize} className="transform -rotate-90">
              <circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={radius}
                fill="transparent"
                stroke="#10B981"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black text-[#0F172A] font-mono leading-none">
                {healthScore.overallScore}
              </span>
              <span className="text-[10px] font-black text-emerald-600 mt-0.5">
                {healthScore.statusText}
              </span>
            </div>
          </div>

          {/* Breakdown checklist */}
          <div className="space-y-1 text-xs font-bold text-slate-600 flex-1 min-w-0">
            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Positive Sentiment</span>
              </span>
              <span className="font-mono font-black text-slate-800">
                {healthScore.metrics.positiveSentiment}%
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Spam Rate</span>
              </span>
              <span className="font-mono font-black text-slate-800">
                {healthScore.metrics.spamRate}%
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Engagement Quality</span>
              </span>
              <span className="font-mono font-black text-slate-800">
                {healthScore.metrics.engagementQuality}%
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Growth Rate</span>
              </span>
              <span className="font-mono font-black text-slate-800">
                {healthScore.metrics.growthRate}%
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Retention Rate</span>
              </span>
              <span className="font-mono font-black text-slate-800">
                {healthScore.metrics.retentionRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
          <span>vs last 30 days</span>
          <span className="text-emerald-600 font-bold inline-flex items-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>{healthScore.growthPercentage}</span>
          </span>
        </div>
      </div>

      {/* ── WIDGET 3: TOP CREATORS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Top Creators</h3>
          <button
            onClick={onViewAllCreators}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1">
          {topCreators.slice(0, 5).map((creator) => (
            <div key={creator.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                  {creator.rank}
                </span>
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] truncate">{creator.name}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">
                {creator.followersCount}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-right">
          Ranked by platform audience reach
        </div>
      </div>
    </div>
  );
};
