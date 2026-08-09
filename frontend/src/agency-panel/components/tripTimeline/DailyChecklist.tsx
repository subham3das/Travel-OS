import React from 'react';
import { CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { DailyChecklistItem } from '../../data/tripTimeline';

interface DailyChecklistProps {
  dayNumber: number;
  items: DailyChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  dayNumber,
  items,
  onToggleItem,
}) => {
  const completedCount = items.filter((item) => item.isCompleted).length;
  const isAllComplete = completedCount === items.length;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-[#583BE8]" />
          <h4 className="text-xs font-black text-[#0F172A]">Day {dayNumber} Operational Checklist</h4>
        </div>
        <span
          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            isAllComplete
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-purple-100 text-[#583BE8] border-purple-200'
          }`}
        >
          {completedCount} / {items.length} Checked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggleItem(item.id)}
            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer text-left ${
              item.isCompleted
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-white border-slate-200/80 text-slate-600 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </div>
            {item.isCompleted && (
              <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                Done
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyChecklist;
