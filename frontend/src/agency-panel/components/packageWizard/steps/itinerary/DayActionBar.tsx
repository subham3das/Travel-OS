import React from 'react';
import { Copy, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface DayActionBarProps {
  dayNumber: number;
  totalDays: number;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const DayActionBar: React.FC<DayActionBarProps> = ({
  dayNumber,
  totalDays,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const isFirst = dayNumber === 1;
  const isLast = dayNumber === totalDays;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100 select-none">
      {/* Duplicate */}
      <button
        type="button"
        onClick={onDuplicate}
        className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplicate Day</span>
      </button>

      {/* Move Up (Desktop only) */}
      <button
        type="button"
        onClick={onMoveUp}
        disabled={isFirst}
        className={`hidden md:flex py-2 px-3 rounded-xl border text-xs font-extrabold items-center justify-center gap-1.5 transition-colors ${
          isFirst
            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
        }`}
      >
        <ArrowUp className="w-3.5 h-3.5" />
        <span>Move Up</span>
      </button>

      {/* Move Down (Desktop only) */}
      <button
        type="button"
        onClick={onMoveDown}
        disabled={isLast}
        className={`hidden md:flex py-2 px-3 rounded-xl border text-xs font-extrabold items-center justify-center gap-1.5 transition-colors ${
          isLast
            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
        }`}
      >
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Move Down</span>
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="py-2 px-3 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Day</span>
      </button>
    </div>
  );
};

export default DayActionBar;
