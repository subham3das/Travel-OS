import React from 'react';
import {
  Shield,
  Key,
  Lock,
  Smartphone,
  Mail,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { AdminSecuritySettings } from '../../../types/profileManagement';

interface SecurityCardProps {
  security: AdminSecuritySettings;
  onOpenPasswordModal: () => void;
  onConfigure2FA: () => void;
  onViewSessions: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  security,
  onOpenPasswordModal,
  onConfigure2FA,
  onViewSessions,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#0F172A]">Security & Authentication</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* 2FA Status */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs block">Two-Factor Auth (2FA)</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enabled (Authenticator)
              </span>
            </div>
          </div>

          <button
            onClick={onConfigure2FA}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            Configure
          </button>
        </div>

        {/* Password */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs block">Account Password</span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Changed {security.lastPasswordChange}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenPasswordModal}
            className="px-2.5 py-1 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-[11px] font-black transition-all cursor-pointer shadow-xs"
          >
            Change
          </button>
        </div>

        {/* Recovery Email */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs block">Recovery Email</span>
              <span className="text-[10px] text-slate-500 font-semibold block font-mono">
                {security.recoveryEmail}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-200">
            Verified
          </span>
        </div>

        {/* Active Sessions */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs block">Active Sessions</span>
              <span className="text-[10px] text-slate-500 font-semibold block font-mono">
                {security.activeSessionsCount} active devices logged in
              </span>
            </div>
          </div>

          <button
            onClick={onViewSessions}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};
