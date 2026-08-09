import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../../utils/sorting';

export interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const options: SortOption[] = [
    'Newest',
    'Oldest',
    'Highest Rating',
    'Lowest Rating',
    'Highest Revenue',
    'Alphabetical',
  ];

  return (
    <div className={`relative inline-flex items-center gap-1.5 select-none ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute left-3" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="pl-8 pr-8 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-extrabold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:ring-2 focus:ring-[#583BE8]/10 transition-all shadow-2xs appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            Sort: {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
