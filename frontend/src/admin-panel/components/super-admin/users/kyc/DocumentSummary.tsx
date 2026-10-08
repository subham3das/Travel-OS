import React from 'react';
import { FileText, ShieldCheck, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { DocumentSummaryData } from '../../../../types/userKyc';

interface DocumentSummaryProps {
  summary: DocumentSummaryData;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  summary,
  activeFilter = 'All',
  onFilterChange,
}) => {
  const items = [
    {
      id: 'All',
      label: 'Uploaded',
      count: summary.uploaded,
      icon: FileText,
      color: 'text-[#6356E5]',
      bg: 'bg-purple-50/70',
      activeRing: 'border-[#6356E5] ring-2 ring-[#6356E5]/20',
    },
    {
      id: 'Verified',
      label: 'Verified',
      count: summary.verified,
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/70',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
    {
      id: 'Pending',
      label: 'Pending',
      count: summary.pending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50/70',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/20',
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      count: summary.rejected,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50/70',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/20',
    },
    {
      id: 'Expired',
      label: 'Expired',
      count: summary.expired,
      icon: AlertTriangle,
      color: 'text-slate-500',
      bg: 'bg-slate-100/70',
      activeRing: 'border-slate-400 ring-2 ring-slate-400/20',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Documents Summary
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          Total: <span className="text-[#0F172A] font-extrabold">{summary.uploaded}</span>
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = activeFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange && onFilterChange(item.id)}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                isSelected
                  ? `${item.activeRing} bg-white shadow-2xs`
                  : `${item.bg} border-transparent hover:border-slate-200`
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <div className="text-sm sm:text-base font-black text-[#0F172A] leading-tight">
                {item.count}
              </div>
              <div className="text-[9px] font-extrabold text-slate-500 truncate mt-0.5">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
