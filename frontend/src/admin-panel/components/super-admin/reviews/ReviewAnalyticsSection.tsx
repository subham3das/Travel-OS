import React, { useState } from 'react';
import { Star } from 'lucide-react';
import {
  RatingDistributionData,
  ReviewTrendDataPoint,
  SentimentBreakdownItem,
} from '../../../types/reviewManagement';

interface ReviewAnalyticsSectionProps {
  ratingDistribution: RatingDistributionData;
  reviewTrend: ReviewTrendDataPoint[];
  sentimentBreakdown: SentimentBreakdownItem[];
  trendInterval: 'Daily' | 'Weekly' | 'Monthly';
  onTrendIntervalChange: (interval: 'Daily' | 'Weekly' | 'Monthly') => void;
}

export const ReviewAnalyticsSection: React.FC<ReviewAnalyticsSectionProps> = ({
  ratingDistribution,
  reviewTrend,
  sentimentBreakdown,
  trendInterval,
  onTrendIntervalChange,
}) => {
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);

  // ── 1. Semi-Circle Gauge Geometry ──
  // Arc from 180 deg to 360 deg
  const gaugeRadius = 70;
  const gaugeThickness = 14;
  const gaugeCenter = 85;

  // ── 2. Review Trend Chart Geometry ──
  const maxReviews = Math.max(...reviewTrend.map((t) => Math.max(t.reviews, t.approved)), 1500);
  const trendPointsReviews = reviewTrend.map((t, idx) => {
    const x = (idx / Math.max(reviewTrend.length - 1, 1)) * 100;
    const y = 100 - (t.reviews / maxReviews) * 90;
    return { x, y, data: t };
  });

  const trendPointsApproved = reviewTrend.map((t, idx) => {
    const x = (idx / Math.max(reviewTrend.length - 1, 1)) * 100;
    const y = 100 - (t.approved / maxReviews) * 90;
    return { x, y, data: t };
  });

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
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

  const reviewsPath = createSmoothPath(trendPointsReviews);
  const approvedPath = createSmoothPath(trendPointsApproved);

  // ── 3. Sentiment Donut Geometry ──
  const donutSize = 130;
  const donutStroke = 18;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativeDonut = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch select-none">
      {/* ── CARD 1: OVERALL RATING DISTRIBUTION (5 Cols) ── */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-sm font-black text-[#0F172A] tracking-tight">
          Overall Rating Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
          {/* Left: Semi-Circle Gauge */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-40 h-24 overflow-hidden flex items-end justify-center">
              <svg viewBox="0 0 170 95" className="w-full h-full">
                <defs>
                  <linearGradient id="gaugeRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6356E5" />
                    <stop offset="25%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="75%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>

                {/* Background Arc */}
                <path
                  d="M 15 85 A 70 70 0 0 1 155 85"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth={gaugeThickness}
                  strokeLinecap="round"
                />

                {/* Rainbow Value Arc */}
                <path
                  d="M 15 85 A 70 70 0 0 1 155 85"
                  fill="none"
                  stroke="url(#gaugeRainbow)"
                  strokeWidth={gaugeThickness}
                  strokeLinecap="round"
                  strokeDasharray="220"
                  strokeDashoffset="20"
                />
              </svg>

              {/* Gauge Center Rating */}
              <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#0F172A] font-mono leading-none">
                  {ratingDistribution.avgRating}
                </span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1">Average Rating</span>
          </div>

          {/* Right: Star Bars List */}
          <div className="sm:col-span-7 space-y-1.5 pl-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-slate-100">
            {ratingDistribution.stars.map((item) => (
              <div key={item.star} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.star} Star</span>
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>Based on 12,842 verified submissions</span>
          <span className="text-emerald-600 font-extrabold">+0.3 vs last month</span>
        </div>
      </div>

      {/* ── CARD 2: REVIEW TREND (4 Cols) ── */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Review Trend</h3>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-600 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#6356E5]" />
              <span>Reviews</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Approved</span>
            </span>
          </div>
        </div>

        {/* Dual Line SVG Chart */}
        <div className="relative h-36 w-full pt-3">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* Reviews Path (Purple) */}
            <path d={reviewsPath} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />

            {/* Approved Path (Green) */}
            <path d={approvedPath} fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />

            {/* Interactive Dots for Reviews */}
            {trendPointsReviews.map((pt, idx) => (
              <circle
                key={`rev-dot-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#6356E5"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onMouseEnter={() => setHoveredTrendIdx(idx)}
                onMouseLeave={() => setHoveredTrendIdx(null)}
              />
            ))}

            {/* Interactive Dots for Approved */}
            {trendPointsApproved.map((pt, idx) => (
              <circle
                key={`app-dot-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="cursor-pointer"
              />
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredTrendIdx !== null && (
            <div
              className="absolute -top-6 bg-slate-900 text-white px-2 py-1 rounded-md text-[10px] font-mono pointer-events-none transform -translate-x-1/2 shadow-lg"
              style={{
                left: `${trendPointsReviews[hoveredTrendIdx].x}%`,
              }}
            >
              {trendPointsReviews[hoveredTrendIdx].data.reviews} reviews
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 pt-1 border-t border-slate-100">
          {reviewTrend.map((d, idx) => (
            <span key={idx}>{d.label}</span>
          ))}
        </div>
      </div>

      {/* ── CARD 3: SENTIMENT ANALYSIS (3 Cols) ── */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Sentiment Analysis</h3>

        <div className="flex items-center justify-between gap-3 my-auto py-2">
          {/* Donut Chart */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {sentimentBreakdown.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                const strokeDashoffset = -((cumulativeDonut / 100) * donutCircumference);
                cumulativeDonut += item.percentage;

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

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Positive</span>
              <span className="text-base font-black text-emerald-600 font-mono leading-none">63.3%</span>
            </div>
          </div>

          {/* Right Legend */}
          <div className="space-y-2.5 min-w-0 flex-1">
            {sentimentBreakdown.map((item) => (
              <div key={item.name} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5 text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </span>
                </div>
                <span className="font-mono font-black text-slate-800 text-[11px] block pl-3.5">
                  {item.count.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          NLP Confidence: 96.8% verified
        </div>
      </div>
    </div>
  );
};
