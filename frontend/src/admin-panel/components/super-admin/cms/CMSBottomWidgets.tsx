import React from 'react';
import {
  Calendar,
  Clock,
  History,
  FolderArchive,
  MoreVertical,
} from 'lucide-react';
import {
  CMSScheduledTimelineItem,
  CMSContentActivityItem,
  CMSVersionHistoryItem,
  CMSMediaUsageItem,
} from '../../../types/cmsManagement';

interface CMSBottomWidgetsProps {
  scheduledTimeline: CMSScheduledTimelineItem[];
  recentActivity: CMSContentActivityItem[];
  versionHistory: CMSVersionHistoryItem[];
  mediaUsage: CMSMediaUsageItem[];
  onViewAllTimeline?: () => void;
  onViewAllActivity?: () => void;
  onViewAllVersions?: () => void;
  onViewAllMedia?: () => void;
}

export const CMSBottomWidgets: React.FC<CMSBottomWidgetsProps> = ({
  scheduledTimeline,
  recentActivity,
  versionHistory,
  mediaUsage,
  onViewAllTimeline,
  onViewAllActivity,
  onViewAllVersions,
  onViewAllMedia,
}) => {
  // Donut geometry for Media Usage
  const donutSize = 110;
  const donutStroke = 15;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativePercent = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: SCHEDULED PUBLISHING TIMELINE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Scheduled Publishing Timeline</h3>
          <button
            onClick={onViewAllTimeline}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-2">
          {scheduledTimeline.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-[#6356E5] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-mono text-slate-400 block truncate">
                    {item.date} - {item.time}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] block truncate">
                    {item.title}
                  </span>
                </div>
              </div>

              <span
                className={`px-1.5 py-0.2 rounded-md text-[9px] font-black shrink-0 ${
                  item.type === 'Banner'
                    ? 'bg-purple-50 text-[#6356E5] border border-purple-100'
                    : item.type === 'Section'
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                {item.type}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          4 upcoming releases scheduled this week
        </div>
      </div>

      {/* ── CARD 2: RECENT CONTENT ACTIVITY ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Recent Content Activity</h3>
          <button
            onClick={onViewAllActivity}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-2">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={act.avatar}
                  alt={act.author}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-[11px] block truncate">
                    {act.author}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block truncate">
                    {act.action}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-mono text-slate-400 shrink-0">{act.timeAgo}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Live collaborative changes saved in real-time
        </div>
      </div>

      {/* ── CARD 3: VERSION HISTORY (HOMEPAGE) ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Version History (Homepage)</h3>
          <button
            onClick={onViewAllVersions}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-2">
          {versionHistory.map((ver) => (
            <div key={ver.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-800 text-[11px]">{ver.version}</span>
                  {ver.status && (
                    <span className="px-1 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-100">
                      {ver.status}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-400 block truncate">
                  {ver.date} at {ver.time}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">
                <span>{ver.author}</span>
                <MoreVertical className="w-3 h-3 text-slate-300 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Auto-versioning enabled with rollback support
        </div>
      </div>

      {/* ── CARD 4: MEDIA USAGE STATISTICS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Media Usage Statistics</h3>
          <button
            onClick={onViewAllMedia}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 py-1">
          {/* Donut Chart */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {mediaUsage.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * donutCircumference);
                cumulativePercent += item.percentage;

                return (
                  <circle
                    key={item.category}
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
              <span className="text-xs font-black font-mono text-slate-900 leading-tight">2,845</span>
              <span className="text-[8px] font-bold text-slate-400">Total Files</span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-1 min-w-0 flex-1">
            {mediaUsage.map((m) => (
              <div key={m.category} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1 text-[10px] truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="truncate">{m.category}</span>
                </span>
                <span className="font-mono font-black text-slate-800 text-[10px] shrink-0">
                  {m.count.toLocaleString()} ({m.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Storage Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-slate-600">
            <span>Storage Used: 4.8 GB / 20 GB</span>
            <span className="font-mono font-black text-[#6356E5]">24%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="w-[24%] h-full bg-[#6356E5] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
