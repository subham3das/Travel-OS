import React from 'react';
import { Bell, CheckCircle2, ShieldAlert, Mail, Clock } from 'lucide-react';
import { NotificationCenterKPISummary } from '../../../types/advancedNotificationCenter';

interface NotificationCenterKPIsProps {
  kpis: NotificationCenterKPISummary;
  onFilterUnread: () => void;
  onFilterCritical: () => void;
  onFilterActionRequired: () => void;
}

export const NotificationCenterKPIs: React.FC<NotificationCenterKPIsProps> = ({
  kpis,
  onFilterUnread,
  onFilterCritical,
  onFilterActionRequired,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
      {/* 1. Today */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100/80 shadow-2xs shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Today
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight block">
            {kpis.today.count}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">
            New Notifications
          </span>
          <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">
            {kpis.today.growth}
          </span>
        </div>
      </div>

      {/* 2. Action Required */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 shadow-2xs shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Action Required
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight block">
            {kpis.actionRequired.count}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">
            {kpis.actionRequired.label}
          </span>
          <button
            type="button"
            onClick={onFilterActionRequired}
            className="text-[9px] font-bold text-[#6356E5] hover:underline block mt-0.5 cursor-pointer text-left"
          >
            View all →
          </button>
        </div>
      </div>

      {/* 3. Critical Alerts */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shadow-2xs shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Critical Alerts
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight block">
            {kpis.criticalAlerts.count}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">
            {kpis.criticalAlerts.label}
          </span>
          <button
            type="button"
            onClick={onFilterCritical}
            className="text-[9px] font-bold text-[#6356E5] hover:underline block mt-0.5 cursor-pointer text-left"
          >
            View all →
          </button>
        </div>
      </div>

      {/* 4. Unread */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shadow-2xs shrink-0">
          <Mail className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Unread
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight block">
            {kpis.unread.count}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">
            {kpis.unread.label}
          </span>
          <button
            type="button"
            onClick={onFilterUnread}
            className="text-[9px] font-bold text-[#6356E5] hover:underline block mt-0.5 cursor-pointer text-left"
          >
            View all →
          </button>
        </div>
      </div>

      {/* 5. Response Time */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100/80 shadow-2xs shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Response Time
          </span>
          <span className="text-xl font-black text-[#0F172A] tracking-tight block">
            {kpis.responseTime.value}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">
            Avg. Time to Action
          </span>
          <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">
            {kpis.responseTime.growth}
          </span>
        </div>
      </div>
    </div>
  );
};
