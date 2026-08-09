import React from 'react';
import { Package, CheckCircle2, Edit3, Archive } from 'lucide-react';

interface PackageStatsProps {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export const PackageStats: React.FC<PackageStatsProps> = ({
  total,
  published,
  draft,
  archived,
}) => {
  const stats = [
    {
      label: 'Total Packages',
      value: total,
      sublabel: 'All packages',
      icon: <Package className="w-5 h-5 text-[#583BE8]" />,
      bg: 'bg-purple-50',
    },
    {
      label: 'Published',
      value: published,
      sublabel: 'Active',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Draft',
      value: draft,
      sublabel: 'Unpublished',
      icon: <Edit3 className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Archived',
      value: archived,
      sublabel: 'Hidden',
      icon: <Archive className="w-5 h-5 text-slate-600" />,
      bg: 'bg-slate-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3.5"
        >
          <div className={`w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 leading-none mb-1">{stat.label}</p>
            <p className="text-xl font-black text-[#0F172A] leading-none mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 leading-none">{stat.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageStats;
