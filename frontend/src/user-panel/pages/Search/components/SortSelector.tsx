import React from 'react';
import { FilterState } from '../../../data/search';

interface SortSelectorProps {
  sortBy: FilterState['sortBy'];
  onChange: (sort: FilterState['sortBy']) => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({ sortBy, onChange }) => {
  const options: { label: string; value: FilterState['sortBy'] }[] = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Lowest Price', value: 'price_low' },
    { label: 'Highest Price', value: 'price_high' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Sort By
      </h4>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = sortBy === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#6356E5] text-white shadow-2xs border border-[#6356E5]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
