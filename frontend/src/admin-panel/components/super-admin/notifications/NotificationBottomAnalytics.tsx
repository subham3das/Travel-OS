import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  FileText,
} from 'lucide-react';
import { NotificationAnalyticsData } from '../../../types/notificationsManagement';

interface NotificationBottomAnalyticsProps {
  analytics: NotificationAnalyticsData;
  onViewAllActivity?: () => void;
}

export const NotificationBottomAnalytics: React.FC<NotificationBottomAnalyticsProps> = ({
  analytics,
  onViewAllActivity,
}) => {
  // Donut geometry for Audience Segmentation
  const donutSize = 110;
  const donutStroke = 15;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativePercent = 0;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'scheduled':
        return <Calendar className="w-3.5 h-3.5 text-purple-500" />;
      case 'sending':
        return <Send className="w-3.5 h-3.5 text-blue-500" />;
      case 'draft_created':
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: NOTIFICATION DELIVERY FUNNEL ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Notification Delivery Funnel</h3>

        <div className="space-y-1.5 py-2">
          {analytics.deliveryFunnel.map((item, idx) => {
            const widthPct = 100 - idx * 16;
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
                    {item.count} {item.percentage !== '100%' && `(${item.percentage})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          98.3% Delivery Rate • 32.4% Open Rate
        </div>
      </div>

      {/* ── CARD 2: HOURLY DELIVERY HEATMAP ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Hourly Delivery Heatmap</h3>

        <div className="space-y-1 py-1">
          {/* Days Grid */}
          <div className="space-y-1">
            {days.map((day, dIdx) => (
              <div key={day} className="flex items-center gap-1.5">
                <span className="w-6 text-[9px] font-mono font-bold text-slate-400">{day}</span>
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {analytics.hourlyHeatmap[dIdx].map((val, hIdx) => (
                    <div
                      key={hIdx}
                      className="h-3 rounded-sm transition-all"
                      style={{
                        backgroundColor: `rgba(99, 86, 229, ${val})`,
                      }}
                      title={`${day} ${hours[hIdx]}: ${(val * 100).toFixed(0)}% activity`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Time axis */}
          <div className="flex justify-between pl-7 text-[8px] font-mono text-slate-400 pt-1">
            {hours.map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
          <span>Low</span>
          <div className="w-24 h-2 rounded-full bg-gradient-to-r from-purple-100 to-[#6356E5]" />
          <span>High</span>
        </div>
      </div>

      {/* ── CARD 3: AUDIENCE SEGMENTATION ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Audience Segmentation</h3>

        <div className="flex items-center justify-between gap-3 py-1">
          {/* Donut */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {analytics.audienceSegmentation.map((seg) => {
                const strokeDasharray = `${(seg.percentage / 100) * donutCircumference} ${donutCircumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * donutCircumference);
                cumulativePercent += seg.percentage;

                return (
                  <circle
                    key={seg.name}
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={donutStroke}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-black font-mono text-slate-900 leading-tight">245.6K</span>
              <span className="text-[8px] font-bold text-slate-400">Total Users</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1 min-w-0 flex-1">
            {analytics.audienceSegmentation.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1.5 text-[10px] truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="truncate">{seg.name}</span>
                </span>
                <span className="font-mono font-black text-slate-800 text-[10px] shrink-0">
                  {seg.count} ({seg.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          58% Travelers • 18% Travel Agencies
        </div>
      </div>

      {/* ── CARD 4: RECENT CAMPAIGN ACTIVITY ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Recent Campaign Activity</h3>

        <div className="space-y-2 py-1">
          {analytics.recentActivity.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0">{getActivityIcon(act.type)}</div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] truncate">{act.title}</p>
                  <p className="text-[9px] text-slate-400 font-medium truncate">{act.author}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.timeAgo}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-right">
          <button
            onClick={onViewAllActivity}
            className="text-[11px] font-bold text-[#6356E5] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Activity</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
