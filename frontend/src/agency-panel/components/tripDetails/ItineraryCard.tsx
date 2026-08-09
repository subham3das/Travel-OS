import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ItineraryItem } from '../../data/tripDetails';

interface ItineraryCardProps {
  itinerary: ItineraryItem[];
  dayBadgeText?: string;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  dayBadgeText = '14 May • Day 1',
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Today's Itinerary</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black border border-purple-100">
          {dayBadgeText}
        </span>
      </div>

      <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-100">
        {itinerary.map((item) => (
          <div
            key={item.id}
            className="relative flex items-center justify-between gap-3 text-xs group cursor-pointer"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#583BE8] ring-4 ring-purple-50" />

            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 w-16 shrink-0">{item.time}</span>
              <span className="font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
                {item.activity}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryCard;
