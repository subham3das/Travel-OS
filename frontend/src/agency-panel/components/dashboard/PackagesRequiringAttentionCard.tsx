import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, UserX, PlusCircle, ArrowUpRight } from 'lucide-react';
import { PackagesRequiringAttentionData } from '../../data/dashboardInsights';

interface PackagesRequiringAttentionCardProps {
  data?: PackagesRequiringAttentionData;
}

export const PackagesRequiringAttentionCard: React.FC<PackagesRequiringAttentionCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const totalActive = data?.totalActive ?? 0;
  const totalIncomplete = data?.totalIncomplete ?? 0;
  const totalSoldOut = data?.totalSoldOut ?? 0;
  const totalBookingClosed = data?.totalBookingClosed ?? 0;
  const attentionPackages = data?.attentionPackages ?? [];

  const totalRequiringAttention = totalIncomplete + totalSoldOut + totalBookingClosed;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A] tracking-tight">
              Packages Requiring Attention
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Only fully configured packages are visible to travelers
            </p>
          </div>
        </div>

        {totalRequiringAttention > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
            {totalRequiringAttention} Action{totalRequiringAttention === 1 ? '' : 's'} Needed
          </span>
        )}
      </div>

      {/* 2. Breakdown KPIs (Clickable Filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/agency/packages?status=Ready to Sell')}
          className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 hover:bg-emerald-50 hover:border-emerald-200 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Active</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-emerald-950 mt-1">{totalActive}</p>
          <span className="text-[10px] font-bold text-emerald-700/80 group-hover:underline">Ready to Sell ✅</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/packages?status=Needs Setup')}
          className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100/80 hover:bg-amber-50 hover:border-amber-200 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Incomplete</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-lg font-black text-amber-950 mt-1">{totalIncomplete}</p>
          <span className="text-[10px] font-bold text-amber-700/80 group-hover:underline">Needs Setup ⚠</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/packages?status=Needs Setup')}
          className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100/80 hover:bg-rose-50 hover:border-rose-200 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Sold Out</span>
            <UserX className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-lg font-black text-rose-950 mt-1">{totalSoldOut}</p>
          <span className="text-[10px] font-bold text-rose-700/80 group-hover:underline">Zero Seats Left</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/packages?status=Needs Setup')}
          className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 hover:bg-slate-100 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Closed</span>
            <Clock className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-lg font-black text-slate-900 mt-1">{totalBookingClosed}</p>
          <span className="text-[10px] font-bold text-slate-500 group-hover:underline">Booking Ended</span>
        </button>
      </div>

      {/* 3. Attention List (Specific Packages) */}
      {attentionPackages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Hidden Packages & Missing Requirements
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {attentionPackages.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-[#0F172A] truncate">
                    {item.packageName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-rose-600">❌ {item.reason}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/agency/packages/${item.packageId || item.id}/edit?step=4`)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:bg-[#583BE8] hover:text-white text-[#583BE8] text-[10px] font-black transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Schedule Departure</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <button
              type="button"
              onClick={() => navigate('/agency/packages?status=Needs Setup')}
              className="text-xs font-black text-[#583BE8] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all {attentionPackages.length} packages requiring attention</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/70 flex items-center gap-3 text-xs text-emerald-800 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>All published packages have valid departures and are visible to travelers!</span>
        </div>
      )}
    </div>
  );
};
