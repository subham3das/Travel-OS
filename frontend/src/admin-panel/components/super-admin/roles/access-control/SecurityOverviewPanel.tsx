import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserX,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { AdminSecurityOverview } from '../../../../types/adminAccessControl';

interface SecurityOverviewPanelProps {
  overview: AdminSecurityOverview;
}

export const SecurityOverviewPanel: React.FC<SecurityOverviewPanelProps> = ({ overview }) => {
  return (
    <div className="space-y-4 select-none">
      {/* ── 1. Login Security Overview ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#6356E5]" />
            <h3 className="text-xs font-black text-[#0F172A]">Login Security Overview</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100">
            Protected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold">Logins Today</span>
            <span className="text-lg font-black text-emerald-700">
              {overview.successfulLoginsToday}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold">Failed Attempts</span>
            <span className="text-lg font-black text-rose-600">
              {overview.failedLoginsCount} blocked
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold">Pending Invites</span>
            <span className="text-lg font-black text-amber-600">
              {overview.pendingInvitations}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold">Locked Accounts</span>
            <span className="text-lg font-black text-slate-800">
              {overview.lockedAccountsCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Security Policies ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Enforced Security Policies</h3>
        </div>

        <div className="space-y-2 text-[11px] font-bold text-slate-700">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span>Authorized Email Gate</span>
            <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Enforced
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span>Role-Based Access (RBAC)</span>
            <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Enforced
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span>2FA for Super Admins</span>
            <span className="text-[10px] text-purple-600 font-black flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Required
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span>Password Complexity (90d)</span>
            <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Recent Login Activity ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Recent Login & Access Activity</h3>
        </div>

        <div className="space-y-2.5">
          {overview.recentActivity.map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A] truncate max-w-[200px]">
                  {act.event}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">{act.time}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{act.user}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
