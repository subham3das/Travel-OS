import React from 'react';
import {
  FileText,
  AlertOctagon,
  Users,
  MessageSquare,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { CommunityActivityEventItem } from '../../../types/communityManagement';

interface CommunityActivitySidebarProps {
  events: CommunityActivityEventItem[];
  onViewAllActivity?: () => void;
}

export const CommunityActivitySidebar: React.FC<CommunityActivitySidebarProps> = ({
  events,
  onViewAllActivity,
}) => {
  const getEventIcon = (type: CommunityActivityEventItem['type']) => {
    switch (type) {
      case 'post':
        return <FileText className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'story_report':
      case 'comment_report':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />;
      case 'member_join':
        return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      case 'circle_create':
        return <Compass className="w-3.5 h-3.5 text-blue-500" />;
      case 'approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'user_warned':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'content_removed':
      default:
        return <Trash2 className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Community Activity</h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Feed</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3.5 py-3.5 relative pl-3.5 flex-1">
        {/* Connector line */}
        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-slate-100" />

        {events.map((event) => (
          <div key={event.id} className="relative flex items-start justify-between gap-2 text-xs">
            {/* Indicator Dot */}
            <div className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center absolute -left-[14px] top-0.5 shadow-2xs">
              {getEventIcon(event.type)}
            </div>

            <div className="min-w-0 pl-1">
              <p className="font-bold text-slate-800 text-[11px] leading-snug truncate">
                {event.title}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {event.subtitle}
              </p>
            </div>

            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {event.timeAgo}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        <button
          onClick={onViewAllActivity}
          className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs text-center"
        >
          View All Activity
        </button>
      </div>
    </div>
  );
};
