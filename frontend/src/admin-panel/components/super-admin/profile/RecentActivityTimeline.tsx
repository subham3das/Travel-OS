import React from 'react';
import {
  Activity,
  CheckCircle2,
  Settings,
  FileText,
  LogIn,
  HardDrive,
} from 'lucide-react';
import { AdminActivityItem } from '../../../types/profileManagement';

interface RecentActivityTimelineProps {
  activities: AdminActivityItem[];
  onViewAllLogs?: () => void;
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  onViewAllLogs,
}) => {
  const getIcon = (type: AdminActivityItem['iconType']) => {
    switch (type) {
      case 'approve':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'settings':
        return <Settings className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'report':
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'login':
        return <LogIn className="w-3.5 h-3.5 text-amber-600" />;
      case 'backup':
      default:
        return <HardDrive className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#0F172A]">Recent Admin Activity</h3>
        </div>

        {onViewAllLogs && (
          <button
            onClick={onViewAllLogs}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View Full Audit Log
          </button>
        )}
      </div>

      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/60 border border-slate-100 text-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              {getIcon(act.iconType)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-black text-[#0F172A] truncate">{act.title}</h4>
                <span className="text-[9px] font-mono text-slate-400 shrink-0">{act.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate pt-0.5">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
