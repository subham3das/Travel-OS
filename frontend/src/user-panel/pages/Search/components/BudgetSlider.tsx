import React from 'react';

interface BudgetSliderProps {
  minBudget: number;
  maxBudget: number;
  onChange: (min: number, max: number) => void;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  minBudget,
  maxBudget,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-black text-[#0F172A]">
        <span>Budget Range</span>
        <span className="text-[#6356E5]">
          ₹{minBudget.toLocaleString('en-IN')} – ₹{maxBudget.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        <input
          type="range"
          min={5000}
          max={150000}
          step={5000}
          value={maxBudget}
          onChange={(e) => onChange(minBudget, Number(e.target.value))}
          className="w-full accent-[#6356E5] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>₹5,000</span>
          <span>₹75,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>
    </div>
  );
};
