import React from 'react';
import { Car, Check } from 'lucide-react';
import { TransportType, TRANSPORT_OPTIONS } from '../../../../types/itinerary';

interface TransportSelectorProps {
  transportation: TransportType[];
  onChange: (transportation: TransportType[]) => void;
}

export const TransportSelector: React.FC<TransportSelectorProps> = ({
  transportation,
  onChange,
}) => {
  const toggleTransport = (mode: TransportType) => {
    if (transportation.includes(mode)) {
      onChange(transportation.filter((t) => t !== mode));
    } else {
      onChange([...transportation, mode]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 select-none">
      <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
        <Car className="w-3.5 h-3.5 text-slate-500" />
        <span>Transportation</span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {TRANSPORT_OPTIONS.map((mode) => {
          const isSelected = transportation.includes(mode);

          return (
            <button
              key={mode}
              type="button"
              onClick={() => toggleTransport(mode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-200'
              }`}
            >
              <span>{mode}</span>
              {isSelected && (
                <div className="w-3.5 h-3.5 rounded-full bg-[#583BE8] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TransportSelector;
