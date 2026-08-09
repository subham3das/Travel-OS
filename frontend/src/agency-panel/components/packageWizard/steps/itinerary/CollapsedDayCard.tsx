import React from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { ItineraryDay } from '../../../../types/itinerary';

interface CollapsedDayCardProps {
  day: ItineraryDay;
  onExpand: (id: string) => void;
}

export const CollapsedDayCard: React.FC<CollapsedDayCardProps> = ({ day, onExpand }) => {
  const activitiesCount = day.activities?.length || 0;
  const mealsText = day.meals?.length > 0 ? day.meals.join(' • ') : null;
  const stayText = day.stay ? day.stay : null;

  return (
    <div
      onClick={() => onExpand(day.id)}
      className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-purple-300 transition-all cursor-pointer shadow-2xs group select-none"
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#583BE8]">Day {day.dayNumber}</span>
          <span className="text-xs font-black text-[#0F172A] group-hover:text-[#583BE8] transition-colors truncate">
            {day.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className="px-2 py-0.5 rounded-lg bg-purple-50 font-bold text-[#583BE8]">
            {activitiesCount} {activitiesCount === 1 ? 'Activity' : 'Activities'}
          </span>
          {mealsText && <span className="truncate">• {mealsText}</span>}
          {stayText && <span className="text-slate-400 truncate">• {stayText}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(day.id);
          }}
          className="p-1.5 rounded-xl bg-purple-50 text-[#583BE8] hover:bg-purple-100 transition-colors cursor-pointer"
          aria-label="Edit Day"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors" />
      </div>
    </div>
  );
};

export default CollapsedDayCard;
