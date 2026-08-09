import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { CheckCircle2, XCircle, Sun, Users, Sparkles } from 'lucide-react';

interface PackageOverviewProps {
  pkg: DetailedPackage;
}

export const PackageOverview: React.FC<PackageOverviewProps> = ({ pkg }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5 select-none overflow-hidden">
      {/* Description & Quick Key Meta */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Package Overview</h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed break-words">
          {pkg.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black">
              <Sun className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Best Season</span>
              <span className="text-xs font-black text-[#0F172A] truncate block">{pkg.bestSeason}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/70 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0 font-black">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Traveler Group Capacity</span>
              <span className="text-xs font-black text-[#0F172A] truncate block">
                Min: {pkg.minTravelers} • Max: {pkg.maxTravelers} Travelers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Package Highlights */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#583BE8] shrink-0" />
          <span>Tour Highlights</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pkg.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-700 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#583BE8] mt-1.5 shrink-0" />
              <span className="break-words min-w-0">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Included & Excluded Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        {/* Included */}
        <div className="space-y-2.5 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 min-w-0">
          <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Inclusions</span>
          </h4>
          <ul className="space-y-2">
            {pkg.included.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-emerald-950 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="break-words min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded */}
        <div className="space-y-2.5 bg-rose-50/40 p-4 rounded-2xl border border-rose-100 min-w-0">
          <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Exclusions</span>
          </h4>
          <ul className="space-y-2">
            {pkg.excluded.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-rose-950 min-w-0">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="break-words min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PackageOverview;
