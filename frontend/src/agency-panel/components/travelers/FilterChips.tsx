import React from 'react';

export type FilterChipValue =
  | 'all'
  | 'groups'
  | 'solo'
  | 'checked-in'
  | 'not-checked-in'
  | 'medical';

interface FilterChipsProps {
  active: FilterChipValue;
  onChange: (v: FilterChipValue) => void;
}

const CHIPS: { label: string; value: FilterChipValue }[] = [
  { label: 'All Travelers', value: 'all' },
  { label: 'Solo Travelers', value: 'solo' },
  { label: 'Group Travelers', value: 'groups' },
  { label: 'Present', value: 'checked-in' },
  { label: 'Absent', value: 'not-checked-in' },
  { label: '🩺 Medical', value: 'medical' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({ active, onChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {CHIPS.map((chip) => {
        const isActive = active === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onChange(chip.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              isActive
                ? 'bg-purple-50 border-[#583BE8] text-[#583BE8] shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-purple-200 hover:text-[#583BE8]'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
