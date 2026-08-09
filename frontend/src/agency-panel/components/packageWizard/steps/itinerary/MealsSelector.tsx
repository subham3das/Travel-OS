import React from 'react';
import { Utensils, Check } from 'lucide-react';
import { MealType, MEAL_OPTIONS } from '../../../../types/itinerary';

interface MealsSelectorProps {
  meals: MealType[];
  onChange: (meals: MealType[]) => void;
}

export const MealsSelector: React.FC<MealsSelectorProps> = ({ meals, onChange }) => {
  const toggleMeal = (meal: MealType) => {
    if (meals.includes(meal)) {
      onChange(meals.filter((m) => m !== meal));
    } else {
      onChange([...meals, meal]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 select-none flex-1">
      <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
        <Utensils className="w-3.5 h-3.5 text-slate-500" />
        <span>Meals Included</span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {MEAL_OPTIONS.map((meal) => {
          const isSelected = meals.includes(meal);

          return (
            <button
              key={meal}
              type="button"
              onClick={() => toggleMeal(meal)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-200'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                  isSelected ? 'border-[#583BE8] bg-[#583BE8] text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{meal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MealsSelector;
