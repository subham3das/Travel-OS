import React from 'react';
import { Clock, Edit3, AlertCircle } from 'lucide-react';
import { TripDifficulty } from '../../../types/packageWizard';

interface DifficultySelectorProps {
  value: TripDifficulty | null;
  onChange: (diff: TripDifficulty) => void;
}

const DIFFICULTIES: {
  level: TripDifficulty;
  icon: React.ReactNode;
  activeCls: string;
}[] = [
  {
    level: 'Easy',
    icon: <Clock className="w-4 h-4" />,
    activeCls: 'bg-emerald-50 border-emerald-500 text-emerald-700',
  },
  {
    level: 'Moderate',
    icon: <Edit3 className="w-4 h-4" />,
    activeCls: 'bg-amber-50 border-amber-500 text-amber-800',
  },
  {
    level: 'Difficult',
    icon: <AlertCircle className="w-4 h-4" />,
    activeCls: 'bg-rose-50 border-rose-500 text-rose-700',
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Trip Difficulty</label>
      <p className="text-xs font-semibold text-slate-400">Select the overall difficulty level of this trip</p>

      <div className="grid grid-cols-3 gap-3 pt-1">
        {DIFFICULTIES.map(({ level, icon, activeCls }) => {
          const isSelected = value === level;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${activeCls} shadow-xs scale-[1.02]`
                  : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {icon}
              <span>{level}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
