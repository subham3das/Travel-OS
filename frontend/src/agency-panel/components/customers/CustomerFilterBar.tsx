import React from 'react';

export type CustomerFilterChip =
  | 'All'
  | 'VIP'
  | 'Returning'
  | 'Solo Travelers'
  | 'Group Travelers'
  | 'Recently Joined'
  | 'Inactive';

interface CustomerFilterBarProps {
  activeChip: CustomerFilterChip;
  onChangeChip: (chip: CustomerFilterChip) => void;
}

const CHIPS: CustomerFilterChip[] = [
  'All',
  'VIP',
  'Returning',
  'Solo Travelers',
  'Group Travelers',
  'Recently Joined',
  'Inactive',
];

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  activeChip,
  onChangeChip,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {CHIPS.map((chip) => {
        const isActive = activeChip === chip;
        return (
          <button
            key={chip}
            type="button"
            onClick={() => onChangeChip(chip)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              isActive
                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-[#2563EB]/20'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
};

export default CustomerFilterBar;
