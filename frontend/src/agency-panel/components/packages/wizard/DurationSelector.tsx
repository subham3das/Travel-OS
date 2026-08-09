import React from 'react';
import { Calendar } from 'lucide-react';
import { DURATION_PRESETS } from '../../../data/destinations';

interface DurationSelectorProps {
  preset: string;
  days: number;
  nights: number;
  onPresetChange: (preset: string, days: number, nights: number) => void;
  onDaysChange: (days: number) => void;
  onNightsChange: (nights: number) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  preset,
  days,
  nights,
  onPresetChange,
  onDaysChange,
  onNightsChange,
}) => {
  const isCustom = preset === 'Custom';

  return (
    <div className="space-y-3 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Trip Duration <span className="text-rose-500">*</span>
      </label>

      {/* Preset Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DURATION_PRESETS.map((item) => {
          const isSelected = preset === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onPresetChange(item.label, item.days, item.nights)}
              className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/60 border-[#583BE8] text-[#583BE8] shadow-md shadow-[#583BE8]/10'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <Calendar
                className={`w-4 h-4 shrink-0 ${
                  isSelected ? 'text-[#583BE8]' : 'text-slate-400'
                }`}
              />
              <span className="text-xs font-black truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Days / Nights numeric input fields */}
      {isCustom && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400">Days:</span>
            <input
              type="number"
              min={1}
              max={60}
              value={days || ''}
              onChange={(e) => onDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-xs font-black text-[#0F172A] focus:outline-none text-center"
            />
          </div>
          <span className="text-slate-300 font-extrabold">/</span>
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400">Nights:</span>
            <input
              type="number"
              min={0}
              max={60}
              value={nights || ''}
              onChange={(e) => onNightsChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-12 text-xs font-black text-[#0F172A] focus:outline-none text-center"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DurationSelector;
