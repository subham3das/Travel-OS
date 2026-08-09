import React from 'react';
import { Star } from 'lucide-react';

interface RatingSelectorProps {
  minRating: number;
  onChange: (rating: number) => void;
}

export const RatingSelector: React.FC<RatingSelectorProps> = ({ minRating, onChange }) => {
  const options = [
    { label: '5 Stars', val: 5 },
    { label: '4+ Stars', val: 4 },
    { label: '3+ Stars', val: 3 },
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Minimum Rating
      </h4>

      <div className="flex items-center gap-2">
        {options.map((opt) => {
          const isSelected = minRating === opt.val;
          return (
            <button
              key={opt.val}
              type="button"
              onClick={() => onChange(isSelected ? 0 : opt.val)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#6356E5] text-white shadow-2xs border border-[#6356E5]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-current text-white' : 'fill-amber-400 text-amber-400'}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
