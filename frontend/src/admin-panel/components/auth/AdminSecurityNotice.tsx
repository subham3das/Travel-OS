import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

/**
 * Admin Security Notice Component
 * Displays enterprise security and monitoring disclosure.
 */
export const AdminSecurityNotice: React.FC = () => {
  return (
    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3 text-left">
      <div className="w-7 h-7 rounded-xl bg-[#583BE8] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Lock className="w-3.5 h-3.5" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
          <span>Security & Audit Notice</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#583BE8]" />
        </p>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          Only authorized administrators can access this portal. All login attempts are monitored and logged for security compliance.
        </p>
      </div>
    </div>
  );
};

export default AdminSecurityNotice;
