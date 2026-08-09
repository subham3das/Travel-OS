import React from 'react';
import { Users, Minus, Plus } from 'lucide-react';

interface CapacitySectionProps {
  minTravelers: number;
  maxTravelers: number;
  recommendedGroupSize: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
  onRecommendedChange: (val: number) => void;
}

export const CapacitySection: React.FC<CapacitySectionProps> = ({
  maxTravelers,
  onMinChange,
  onMaxChange,
  onRecommendedChange,
}) => {
  const handleValueChange = (val: number) => {
    const safeVal = Math.max(1, val);
    onMaxChange(safeVal);
    onMinChange(1);
    onRecommendedChange(Math.min(safeVal, Math.max(1, Math.round(safeVal * 0.75))));
  };

  return (
    <div className="select-none">
      {/* Single Add People Card */}
      <div className="bg-purple-50/60 rounded-3xl p-5 border-2 border-[#583BE8] shadow-md shadow-[#583BE8]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
              Add People <span className="text-rose-500">*</span>
            </h4>
            <p className="text-[11px] font-semibold text-slate-500">
              Set the maximum number of persons allowed for this package
            </p>
          </div>
        </div>

        {/* Stepper + Input Box */}
        <div className="flex items-center gap-2 self-end sm:self-center bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => handleValueChange((maxTravelers || 1) - 1)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#583BE8] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Decrease persons"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-2">
            <input
              type="number"
              min={1}
              value={maxTravelers || ''}
              onChange={(e) => handleValueChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center text-base font-black text-[#0F172A] focus:outline-none bg-transparent"
              placeholder="0"
            />
            <span className="text-xs font-extrabold text-[#583BE8]">Persons</span>
          </div>

          <button
            type="button"
            onClick={() => handleValueChange((maxTravelers || 0) + 1)}
            className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Increase persons"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapacitySection;
