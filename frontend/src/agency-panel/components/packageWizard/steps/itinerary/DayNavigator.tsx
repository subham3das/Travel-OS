import React from 'react';
import { Plus } from 'lucide-react';
import { ItineraryDay } from '../../../../types/itinerary';

interface DayNavigatorProps {
  days: ItineraryDay[];
  activeDayId: string;
  onSelectDay: (id: string) => void;
  onAddDay: () => void;
}

export const DayNavigator: React.FC<DayNavigatorProps> = ({
  days,
  activeDayId,
  onSelectDay,
  onAddDay,
}) => {
  return (
    <div className="flex flex-col items-center space-y-3 shrink-0 select-none">
      {days.map((day, index) => {
        const isSelected = day.id === activeDayId;

        return (
          <React.Fragment key={day.id}>
            {index > 0 && <div className="w-0.5 h-3 border-l-2 border-dashed border-slate-200" />}

            <button
              type="button"
              onClick={() => onSelectDay(day.id)}
              className={`w-24 sm:w-28 py-3 rounded-2xl border text-xs font-black flex items-center justify-between px-3.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8] text-[#583BE8] shadow-md shadow-[#583BE8]/15 scale-105'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-[#583BE8] bg-[#583BE8]' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          </React.Fragment>
        );
      })}

      <div className="w-0.5 h-3 border-l-2 border-dashed border-slate-200" />

      {/* Add Day Button */}
      <button
        type="button"
        onClick={onAddDay}
        className="w-24 sm:w-28 py-3 rounded-2xl border-2 border-dashed border-[#583BE8]/50 hover:border-[#583BE8] bg-purple-50/40 hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Add Day</span>
      </button>
    </div>
  );
};

export default DayNavigator;
