import React from 'react';
import { ALL_MONTHS } from '../../../data/destinations';

interface MonthSelectorProps {
  selectedMonths: string[];
  onChange: (months: string[]) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonths,
  onChange,
}) => {
  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      onChange(selectedMonths.filter((m) => m !== month));
    } else {
      onChange([...selectedMonths, month]);
    }
  };

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Best Time to Visit</label>
      <p className="text-xs font-semibold text-slate-400">Select the best months to travel</p>

      <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 pt-1">
        {ALL_MONTHS.map((month) => {
          const isSelected = selectedMonths.includes(month);

          return (
            <button
              key={month}
              type="button"
              onClick={() => toggleMonth(month)}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer text-center ${
                isSelected
                  ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/20 scale-[1.03]'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSelector;
