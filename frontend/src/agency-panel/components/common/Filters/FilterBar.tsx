import React from 'react';

export interface FilterChipProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
        isActive
          ? 'bg-[#583BE8] text-white border-[#583BE8] shadow-md shadow-[#583BE8]/20'
          : 'bg-white text-slate-600 border-slate-200 hover:border-[#583BE8] hover:text-[#583BE8]'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export interface FilterBarProps {
  options: { id: string; label: string; count?: number }[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  activeId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none ${className}`}>
      {options.map((opt) => (
        <FilterChip
          key={opt.id}
          label={opt.label}
          count={opt.count}
          isActive={activeId === opt.id}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
};

export default FilterBar;
