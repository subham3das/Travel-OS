import React from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Star,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { FinancialTimelineItem } from '../../../types/financeManagement';

interface FinancialTimelineProps {
  items: FinancialTimelineItem[];
  onViewFullTimeline?: () => void;
}

export const FinancialTimeline: React.FC<FinancialTimelineProps> = ({
  items,
  onViewFullTimeline,
}) => {
  const getIcon = (type: FinancialTimelineItem['type']) => {
    switch (type) {
      case 'revenue':
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />;
      case 'disbursement':
        return <TrendingUp className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'refund':
        return <RotateCcw className="w-3.5 h-3.5 text-rose-600" />;
      case 'target':
        return <Star className="w-3.5 h-3.5 text-blue-600" />;
      case 'record':
      default:
        return <Trophy className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none flex flex-col justify-between h-full">
      <h3 className="text-sm font-black text-[#0F172A]">Financial Timeline</h3>

      <div className="space-y-3.5 flex-1">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
              {getIcon(item.type)}
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1 text-xs">
              <span className="font-bold text-[#0F172A] whitespace-nowrap text-[11px]">
                {item.date}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-600 truncate text-[11px]">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={onViewFullTimeline}
          className="inline-flex items-center gap-1 text-xs font-black text-[#6356E5] hover:text-[#5244e0] transition-colors cursor-pointer"
        >
          <span>View Full Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
