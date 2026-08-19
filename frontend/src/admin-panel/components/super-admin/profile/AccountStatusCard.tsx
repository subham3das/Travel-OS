import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { AdminAccountStatus } from '../../../types/profileManagement';

interface AccountStatusCardProps {
  status: AdminAccountStatus;
}

export const AccountStatusCard: React.FC<AccountStatusCardProps> = ({ status }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Account Status</h3>
        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200">
          Excellent
        </span>
      </div>

      {/* Security Score Meter */}
      <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Security Score</span>
          <span className="font-black text-[#6356E5] font-mono">{status.securityScore}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#6356E5]"
            style={{ width: `${status.securityScore}%` }}
          />
        </div>
        <span className="text-[9px] text-slate-400 font-medium block">
          All high-tier security policies enforced
        </span>
      </div>

      {/* Verification Checklist */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>Identity Verified</span>
          </div>
          <span className="text-emerald-600 font-black text-[10px]">Active</span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>2-Factor Auth (2FA)</span>
          </div>
          <span className="text-emerald-600 font-black text-[10px]">Enabled</span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>Primary Email Verified</span>
          </div>
          <span className="text-emerald-600 font-black text-[10px]">Verified</span>
        </div>
      </div>
    </div>
  );
};
