import React from 'react';
import { Bed, ChevronDown, X } from 'lucide-react';
import { StayType, STAY_OPTIONS } from '../../../../types/itinerary';

interface StaySelectorProps {
  stay: StayType | string;
  onChange: (stay: StayType | string) => void;
}

export const StaySelector: React.FC<StaySelectorProps> = ({ stay, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 select-none flex-1">
      <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
        <Bed className="w-3.5 h-3.5 text-slate-500" />
        <span>Stay</span>
      </div>

      <div className="relative pt-1">
        <select
          value={stay}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A] appearance-none focus:outline-none focus:border-[#583BE8] cursor-pointer truncate"
        >
          {STAY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-3 flex items-center gap-1 text-slate-400 pointer-events-none">
          {stay && <X className="w-3 h-3 text-slate-400 pointer-events-auto hover:text-slate-600 cursor-pointer" onClick={() => onChange('Hotel')} />}
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default StaySelector;
