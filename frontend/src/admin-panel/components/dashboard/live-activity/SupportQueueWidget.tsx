import React from 'react';
import { Headphones, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupportQueueItem } from '../../../types/liveActivityCenter';

interface SupportQueueWidgetProps {
  queue: SupportQueueItem[];
}

export const SupportQueueWidget: React.FC<SupportQueueWidgetProps> = ({ queue }) => {
  const navigate = useNavigate();

  const getPriorityBadge = (priority: SupportQueueItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-600 border border-rose-200 text-[8px] font-black">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[8px] font-black">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[8px] font-black">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[8px] font-black">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col justify-between">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-rose-500" />
          <h3 className="text-xs font-black text-[#0F172A]">Live Support Queue</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/support')}
          className="text-[10px] font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {queue.map((tkt) => (
          <div
            key={tkt.id}
            onClick={() => navigate(tkt.targetRoute)}
            className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/70 border border-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2"
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-[#6356E5]">{tkt.id}</span>
                {getPriorityBadge(tkt.priority)}
                <span className="text-xs font-bold text-slate-800 truncate">{tkt.subject}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Raised by {tkt.user}
              </p>
            </div>

            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[9px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                {tkt.status}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold">{tkt.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
