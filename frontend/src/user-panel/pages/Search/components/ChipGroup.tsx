import React from 'react';

interface ChipGroupProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (updated: string[]) => void;
  isMulti?: boolean;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  title,
  options,
  selectedOptions,
  onChange,
  isMulti = true,
}) => {
  const toggleOption = (opt: string) => {
    if (isMulti) {
      if (selectedOptions.includes(opt)) {
        onChange(selectedOptions.filter((item) => item !== opt));
      } else {
        onChange([...selectedOptions, opt]);
      }
    } else {
      if (selectedOptions.includes(opt)) {
        onChange([]);
      } else {
        onChange([opt]);
      }
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        {title}
      </h4>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#6356E5] text-white shadow-2xs border border-[#6356E5]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
