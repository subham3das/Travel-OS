import React from 'react';
import { Settings, Sliders, Plus, Sparkles } from 'lucide-react';

interface NotificationCenterHeaderProps {
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenNewNotification: () => void;
}

export const NotificationCenterHeader: React.FC<NotificationCenterHeaderProps> = ({
  onOpenRules,
  onOpenSettings,
  onOpenNewNotification,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      {/* Title + Beta Badge + Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Advanced Notification Center
          </h1>
          <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-[#6356E5] text-[10px] font-black uppercase tracking-wider border border-purple-200">
            BETA
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Real-time notifications and alerts across the entire platform.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={onOpenRules}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-slate-400" />
          <span>Notification Rules</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewNotification}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Notification</span>
        </button>
      </div>
    </div>
  );
};
