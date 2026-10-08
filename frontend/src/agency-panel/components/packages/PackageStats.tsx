import React from 'react';
import { Package, CheckCircle2, Edit3, Archive, AlertTriangle, Sparkles } from 'lucide-react';

interface PackageStatsProps {
  total: number;
  published: number;
  draft: number;
  archived: number;
  readyToSell?: number;
  needsSetup?: number;
  onSelectFilter?: (filter: string) => void;
}

export const PackageStats: React.FC<PackageStatsProps> = ({
  total,
  published,
  draft,
  archived,
  readyToSell,
  needsSetup,
  onSelectFilter,
}) => {
  const stats = [
    {
      label: 'Ready to Sell',
      value: readyToSell !== undefined ? readyToSell : published,
      sublabel: 'Bookable by Travelers',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      badge: '✅ Visible',
      filterKey: 'Ready to Sell',
    },
    {
      label: 'Needs Setup',
      value: needsSetup !== undefined ? needsSetup : Math.max(0, total - (readyToSell || published)),
      sublabel: 'Hidden from Travelers',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      badge: '⚠ Action Required',
      filterKey: 'Needs Setup',
    },
    {
      label: 'Total Packages',
      value: total,
      sublabel: 'All inventory',
      icon: <Package className="w-5 h-5 text-[#583BE8]" />,
      bg: 'bg-purple-50',
      filterKey: 'All',
    },
    {
      label: 'Draft / Inactive',
      value: draft + archived,
      sublabel: `${draft} Draft · ${archived} Archived`,
      icon: <Edit3 className="w-5 h-5 text-slate-600" />,
      bg: 'bg-slate-100',
      filterKey: 'Draft',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          onClick={() => onSelectFilter?.(stat.filterKey)}
          className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3.5 hover:shadow-md hover:border-purple-200/80 transition-all cursor-pointer group"
        >
          <div className={`w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 leading-none mb-1 truncate">{stat.label}</p>
            <p className="text-xl font-black text-[#0F172A] leading-none mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 leading-none truncate">{stat.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageStats;
