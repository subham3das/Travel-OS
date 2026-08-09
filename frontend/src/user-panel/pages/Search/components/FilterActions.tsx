import React from 'react';
import { RotateCcw, Check } from 'lucide-react';

interface FilterActionsProps {
  totalCount: number;
  onReset: () => void;
  onApply: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  totalCount,
  onReset,
  onApply,
}) => {
  return (
    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-black text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer focus:outline-none"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>

      <button
        type="button"
        onClick={onApply}
        className="px-6 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center gap-2 cursor-pointer transition-all focus:outline-none"
      >
        <Check className="w-4 h-4" />
        <span>Apply ({totalCount} Results)</span>
      </button>
    </div>
  );
};
