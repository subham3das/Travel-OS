import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePackageWizard } from '../../../hooks/usePackageWizard';
import { PackageSummaryHeader } from './itinerary/PackageSummaryHeader';
import { DayPlanningCard } from './itinerary/DayPlanningCard';
import { ItineraryDay } from '../../../types/itinerary';

export const ItineraryStep: React.FC = () => {
  const {
    draft,
    updateStep4,
    addItineraryDay,
    deleteItineraryDay,
    duplicateItineraryDay,
    moveItineraryDay,
    addPlanItem,
    updatePlanItem,
    removePlanItem,
    movePlanItem,
  } = usePackageWizard();

  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const step4 = draft?.step4 || {
    days: [],
    activeDayId: 'day-1',
  };

  const days = step4.days || [];
  const packageDaysCount = draft?.step2?.days || 4;
  const isDurationMatched = days.length === packageDaysCount;

  const handleUpdateDay = (dayId: string, data: Partial<ItineraryDay>) => {
    const updatedDays = days.map((d) => (d.id === dayId ? { ...d, ...data } : d));
    updateStep4({ days: updatedDays });
  };

  const handleScrollToDay = (id: string) => {
    updateStep4({ activeDayId: id });
    dayRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddDay = () => {
    addItineraryDay();
    setTimeout(() => {
      const nextDays = draft?.step4?.days || [];
      const newCreatedDayId = nextDays[nextDays.length - 1]?.id;
      if (newCreatedDayId && dayRefs.current[newCreatedDayId]) {
        dayRefs.current[newCreatedDayId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* 1. Package Summary Header Card */}
      <PackageSummaryHeader />

      {/* 2. Section Header & Duration Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Day-wise Itinerary Notes
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Outline key highlights and activities planned for each day of the journey.
          </p>
        </div>

        {/* Duration Match Pill */}
        <div className="shrink-0 flex items-center gap-2">
          {isDurationMatched ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{days.length} of {packageDaysCount} Days Planned</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>
                {days.length} of {packageDaysCount} Days ({days.length < packageDaysCount ? `Need ${packageDaysCount - days.length} more` : `Remove ${days.length - packageDaysCount}`})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Quick Day Jump Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sticky top-16 z-20 bg-[#F8F9FC]/90 backdrop-blur-md py-2 px-1">
        {days.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => handleScrollToDay(day.id)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-extrabold text-[#0F172A] hover:border-[#583BE8] hover:text-[#583BE8] transition-all cursor-pointer shrink-0 shadow-2xs active:scale-98"
          >
            Day {day.dayNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={handleAddDay}
          className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#583BE8] border border-purple-200/70 text-xs font-extrabold flex items-center gap-1 hover:bg-purple-100 transition-all cursor-pointer shrink-0 active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Day</span>
        </button>
      </div>

      {/* 4. Sequential Day Planning Cards */}
      <div className="space-y-5">
        {days.map((day) => (
          <div
            key={day.id}
            ref={(el) => {
              dayRefs.current[day.id] = el;
            }}
            className="scroll-mt-32"
          >
            <DayPlanningCard
              day={day}
              totalDays={days.length}
              onUpdateDay={(data) => handleUpdateDay(day.id, data)}
              onDuplicateDay={() => duplicateItineraryDay(day.id)}
              onMoveUp={() => moveItineraryDay(day.id, 'up')}
              onMoveDown={() => moveItineraryDay(day.id, 'down')}
              onDeleteDay={() => deleteItineraryDay(day.id)}
              onAddPlan={addPlanItem}
              onUpdatePlan={updatePlanItem}
              onRemovePlan={removePlanItem}
              onMovePlan={movePlanItem}
            />
          </div>
        ))}
      </div>

      {/* 5. Bottom Add Day Bar */}
      <div className="pt-2 pb-6">
        <button
          type="button"
          onClick={handleAddDay}
          className="w-full py-4 rounded-3xl border-2 border-dashed border-[#583BE8]/60 bg-white hover:bg-purple-50/50 text-[#583BE8] text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-99"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Day {days.length + 1} Planning Card</span>
        </button>
      </div>
    </div>
  );
};

export default ItineraryStep;
