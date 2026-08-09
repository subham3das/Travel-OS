import React from 'react';
import { Clock, X } from 'lucide-react';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelect,
  onRemove,
  onClearAll,
}) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Recent Searches
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs font-extrabold text-[#6356E5] hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {searches.map((term) => (
          <div
            key={term}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700 hover:border-[#6356E5] hover:text-[#6356E5] transition-all cursor-pointer shrink-0 group"
            onClick={() => onSelect(term)}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6356E5]" />
            <span>{term}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
              className="ml-1 p-0.5 rounded-full text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
