import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { OperationsChecklistItem } from '../../data/tripDetails';

interface OperationalChecklistCardProps {
  checklist: OperationsChecklistItem[];
}

export const OperationalChecklistCard: React.FC<OperationalChecklistCardProps> = ({
  checklist,
}) => {
  const completedCount = checklist.filter((item) => item.isCompleted).length;
  const totalCount = checklist.length;
  const isFullyComplete = completedCount === totalCount;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-black text-[#0F172A]">Operations Checklist</h3>
        <span
          className={`text-xs font-black px-3 py-1 rounded-full border ${
            isFullyComplete
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-purple-50 text-[#583BE8] border-purple-200'
          }`}
        >
          {completedCount} / {totalCount} Completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFullyComplete ? 'bg-emerald-500' : 'bg-[#583BE8]'
          }`}
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* 4-item Checklist — read-only, auto-driven by real data */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              item.isCompleted
                ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                : 'bg-slate-50 border-slate-200/70 text-slate-500'
            }`}
          >
            {item.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className="leading-tight">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Warning when incomplete */}
      {!isFullyComplete && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Complete all sections below to activate this trip.</span>
        </div>
      )}
    </div>
  );
};

// Re-export legacy type alias for backward compatibility
export type { OperationsChecklistItem as ChecklistItem };

export default OperationalChecklistCard;
