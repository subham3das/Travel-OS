import React from 'react';
import { ShieldCheck, CheckCircle2, Building2, UserCheck, Sliders } from 'lucide-react';
import { AdminLoginCard } from './AdminLoginCard';
import { AdminDesktopOnly } from './AdminDesktopOnly';

/**
 * Split-Screen Desktop Layout for Admin Authentication (/admin/login)
 */
export const AdminAuthLayout: React.FC = () => {
  return (
    <>
      {/* ── Screen Width Guard: Small Screens / Mobile fallback (< 1024px) ── */}
      <div className="lg:hidden">
        <AdminDesktopOnly />
      </div>

      {/* ── Desktop Split Screen (>= 1024px) ── */}
      <div className="hidden lg:flex min-h-screen w-full font-sans select-none bg-[#F8F9FC] text-[#0F172A] overflow-hidden">
        {/* ── LEFT PANEL (45% Width) ── */}
        <div className="w-[45%] bg-gradient-to-br from-[#0F0826] via-[#1A0A45] to-[#583BE8] text-white p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          {/* Subtle background glow elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#583BE8]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                  fill="white"
                  fillOpacity="0.3"
                />
                <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
                <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Apna<span className="text-purple-300">Trip</span>
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase text-purple-300/80 block mt-0.5">
                Admin Control Portal
              </span>
            </div>
          </div>

          {/* Middle Content Section */}
          <div className="relative z-10 space-y-8 my-auto max-w-lg">
            <div className="space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                Enterprise Control System
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Admin Portal
              </h1>
              <p className="text-sm text-purple-200/90 font-medium leading-relaxed">
                Manage agencies, approvals and platform operations securely.
              </p>
            </div>

            {/* 3 Feature Cards */}
            <div className="space-y-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-sm hover:bg-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-300/30 text-purple-200 flex items-center justify-center shrink-0">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Review Agency Applications</span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80 font-medium">
                    Inspect onboarding documents, GST, and business registrations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-sm hover:bg-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-300/30 text-purple-200 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve & Reject Agencies</span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80 font-medium">
                    Grant dashboard permissions or request revision details.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-sm hover:bg-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-300/30 text-purple-200 flex items-center justify-center shrink-0">
                  <Sliders className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Manage Platform Operations</span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80 font-medium">
                    Monitor platform analytics, audits, and system configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Version */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-purple-300/70 font-semibold border-t border-white/10 pt-4">
            <span>© 2026 ApnaTrip Inc.</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded-md text-white/80">Version v1.0</span>
          </div>
        </div>

        {/* ── RIGHT PANEL (55% Width) ── */}
        <div className="w-[55%] flex items-center justify-center p-8 bg-[#F8F9FC] relative">
          <AdminLoginCard />
        </div>
      </div>
    </>
  );
};

export default AdminAuthLayout;
