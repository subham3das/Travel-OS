import React from 'react';
import { MonitorX, ShieldAlert } from 'lucide-react';

/**
 * Mobile / Small Screen Fallback Notice
 * Displayed when viewport width is below 1024px.
 */
export const AdminDesktopOnly: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 text-center font-sans select-none">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        {/* Desktop Only Illustration */}
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-[#583BE8] flex items-center justify-center mx-auto shadow-inner">
          <MonitorX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black tracking-wider uppercase border border-purple-500/20 inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Desktop Only Access
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Admin Portal is available on desktop only.
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            For operational security and administrative efficiency, the Super Admin Portal requires a minimum screen resolution of 1024px.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
          <p className="font-bold text-slate-200">Recommended Resolution:</p>
          <p className="font-mono text-[11px] text-purple-300">1440 × 900px or 1920 × 1080px</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDesktopOnly;
