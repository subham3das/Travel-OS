import React, { useState } from 'react';
import { ItineraryDayDetail } from '../../../data/packageDetails';
import { Calendar, ChevronDown, ChevronUp, Utensils, Hotel, Car, CheckCircle2 } from 'lucide-react';

interface ItineraryTimelineProps {
  itinerary: ItineraryDayDetail[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay((prev) => (prev === dayNum ? null : dayNum));
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
          <span className="truncate">Itinerary ({itinerary.length} Days)</span>
        </h3>

        <button
          type="button"
          onClick={() => setExpandedDay(expandedDay ? null : 1)}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer shrink-0"
        >
          {expandedDay ? 'Collapse All' : 'Expand First'}
        </button>
      </div>

      <div className="space-y-3">
        {itinerary.map((day) => {
          const isOpen = expandedDay === day.dayNumber;
          return (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'border-purple-200 bg-purple-50/30 shadow-2xs' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {/* Day Accordion Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-[#583BE8] text-white font-black text-xs flex items-center justify-center shrink-0">
                    D{day.dayNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                      {day.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 truncate">
                      {day.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#583BE8]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Day Expanded Details */}
              {isOpen && (
                <div className="p-3.5 sm:p-4 pt-0 border-t border-purple-100/70 space-y-3 text-xs font-semibold text-slate-600">
                  <p className="pt-2 leading-relaxed text-slate-700 break-words">{day.description}</p>

                  {/* Activities List */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Activities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {day.activities.map((act, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-900 font-extrabold flex items-center gap-1 max-w-full truncate">
                            <CheckCircle2 className="w-3 h-3 text-[#583BE8] shrink-0" />
                            <span className="truncate">{act}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Logistics Pills: Meals, Stay, Transport */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-purple-100/60 text-[11px]">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 min-w-0">
                      <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">Meals: {day.meals.join(', ') || 'Self Managed'}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 min-w-0">
                      <Hotel className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">Stay: {day.stay}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 min-w-0">
                      <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Transport: {day.transportation.join(', ')}</span>
                    </div>
                  </div>

                  {day.notes && (
                    <p className="p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-900 break-words">
                      Note: {day.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
