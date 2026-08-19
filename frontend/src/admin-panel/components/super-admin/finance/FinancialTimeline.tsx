import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Banknote,
  AlertTriangle,
  Target,
  Trophy,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { FinancialTimelineEvent } from '../../../types/financeManagement';

interface FinancialTimelineProps {
  events: FinancialTimelineEvent[];
  onViewAll?: () => void;
}

export const FinancialTimeline: React.FC<FinancialTimelineProps> = ({ events, onViewAll }) => {
  const getEventIcon = (type: FinancialTimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 'payout':
        return { icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
      case 'refund_spike':
        return { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
      case 'target_achieved':
        return { icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
      case 'peak_revenue':
      default:
        return { icon: TrendingUp, color: 'text-[#6356E5]', bg: 'bg-purple-50 border-purple-200' };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Financial Timeline</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
              Live Feed
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Real-time audit log of financial milestones & disbursements
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="py-4 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-slate-100" />

        <div className="space-y-4">
          {events.map((event) => {
            const { icon: Icon, color, bg } = getEventIcon(event.type);
            return (
              <div key={event.id} className="relative flex items-start gap-3 group">
                {/* Node icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 z-10 bg-white ${bg} shadow-2xs`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/80 group-hover:border-purple-200 group-hover:bg-purple-50/20 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-black text-xs text-[#0F172A] truncate">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                      {event.time}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                    {event.description}
                  </p>

                  {event.amount && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#6356E5] font-mono bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                        {event.amount}
                      </span>
                      {event.badge && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {event.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">
          Showing recent {events.length} transactions
        </span>
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#6356E5] hover:text-[#5245cc] flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>View Full Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
