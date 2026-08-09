import React, { useState } from 'react';
import { ChevronRight, Plane, Hotel, MapPin, Utensils, Bed } from 'lucide-react';
import { PackageItineraryDay } from '../../../types/package';

interface ItineraryTimelineProps {
  itinerary: PackageItineraryDay[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const activeDay = itinerary[selectedDayIdx] || itinerary[0];

  const getIconForActivity = (act: string) => {
    const lower = act.toLowerCase();
    if (lower.includes('airport') || lower.includes('flight')) return <Plane className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (lower.includes('hotel') || lower.includes('check-in')) return <Hotel className="w-4 h-4 text-sky-600 shrink-0" />;
    if (lower.includes('sightseeing') || lower.includes('visit') || lower.includes('walk')) return <MapPin className="w-4 h-4 text-amber-500 shrink-0" />;
    if (lower.includes('dinner') || lower.includes('breakfast') || lower.includes('food')) return <Utensils className="w-4 h-4 text-rose-500 shrink-0" />;
    if (lower.includes('overnight') || lower.includes('stay')) return <Bed className="w-4 h-4 text-indigo-500 shrink-0" />;
    return <span className="w-2 h-2 rounded-full bg-[#6356E5] shrink-0" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Day-wise Itinerary
        </h2>
        <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>View Full Itinerary</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Day Selection List */}
        <div className="md:col-span-5 space-y-2">
          {itinerary.map((item, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-[#EEF2FF] border-2 border-[#6356E5] shadow-2xs'
                    : 'bg-white border border-slate-100/90 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                    isSelected ? 'bg-[#6356E5] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Day {item.day}
                </span>
                <span
                  className={`text-xs sm:text-sm font-extrabold truncate ${
                    isSelected ? 'text-[#6356E5]' : 'text-[#0F172A]'
                  }`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Active Day Detail Box */}
        <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400">Day {activeDay.day}</span>
              <h3 className="text-lg font-black text-[#0F172A]">{activeDay.title}</h3>
            </div>

            <div className="space-y-3">
              {activeDay.activities.map((act, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700">
                  {getIconForActivity(act)}
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {activeDay.image && (
            <div className="rounded-2xl overflow-hidden h-44 bg-slate-100 mt-2 border border-slate-100">
              <img src={activeDay.image} alt={activeDay.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
