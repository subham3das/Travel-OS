import React from 'react';
import { ChevronDown } from 'lucide-react';

export type PackageFilterType =
  | 'All'
  | 'Active'
  | 'Draft'
  | 'Hidden'
  | 'Domestic'
  | 'International';

interface PackageFiltersProps {
  activeFilter: PackageFilterType;
  onChange: (filter: PackageFilterType) => void;
  onMoreClick?: () => void;
}

const CHIPS: PackageFilterType[] = [
  'All',
  'Active',
  'Draft',
  'Hidden',
  'Domestic',
  'International',
];

export const PackageFilters: React.FC<PackageFiltersProps> = ({
  activeFilter,
  onChange,
  onMoreClick,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {CHIPS.map((chip) => {
        const isActive = activeFilter === chip;
        return (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
              isActive
                ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-purple-200 hover:text-[#583BE8]'
            }`}
          >
            {chip}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onMoreClick || (() => alert('More package filters coming soon'))}
        className="px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap bg-white border border-slate-200 text-slate-600 hover:border-purple-200 hover:text-[#583BE8] transition-all cursor-pointer flex items-center gap-1 shrink-0"
      >
        <span>More</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PackageFilters;
