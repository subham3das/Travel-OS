import React from 'react';
import { Plane, Bus, Train, Car, Footprints, CheckCircle2 } from 'lucide-react';
import { TravelMode } from '../../../data/destinations';

interface TravelModeSelectorProps {
  selectedModes: TravelMode[];
  onChange: (modes: TravelMode[]) => void;
}

const MODES_CONFIG: { mode: TravelMode; icon: React.ReactNode }[] = [
  { mode: 'Flight', icon: <Plane className="w-4 h-4" /> },
  { mode: 'Bus', icon: <Bus className="w-4 h-4" /> },
  { mode: 'Train', icon: <Train className="w-4 h-4" /> },
  { mode: 'Private Vehicle', icon: <Car className="w-4 h-4" /> },
  { mode: 'Trek', icon: <Footprints className="w-4 h-4" /> },
];

export const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({
  selectedModes,
  onChange,
}) => {
  const toggleMode = (mode: TravelMode) => {
    if (selectedModes.includes(mode)) {
      onChange(selectedModes.filter((m) => m !== mode));
    } else {
      onChange([...selectedModes, mode]);
    }
  };

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Travel Mode <span className="text-rose-500">*</span>{' '}
        <span className="text-xs font-semibold text-slate-400">(Select all that apply)</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {MODES_CONFIG.map(({ mode, icon }) => {
          const isSelected = selectedModes.includes(mode);

          return (
            <button
              key={mode}
              type="button"
              onClick={() => toggleMode(mode)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-purple-50/60 border-[#583BE8] text-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#583BE8] text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {icon}
                </div>
                <span className="text-xs font-black truncate">{mode}</span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#583BE8] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 fill-white stroke-[#583BE8]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TravelModeSelector;
