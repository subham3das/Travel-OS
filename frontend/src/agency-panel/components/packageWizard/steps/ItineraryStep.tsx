import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { usePackageWizard } from '../../../hooks/usePackageWizard';
import { PackageSummaryHeader } from './itinerary/PackageSummaryHeader';
import { DayNavigator } from './itinerary/DayNavigator';
import { DayEditor } from './itinerary/DayEditor';
import { CollapsedDayCard } from './itinerary/CollapsedDayCard';
import { ItineraryDay } from '../../../types/itinerary';

export const ItineraryStep: React.FC = () => {
  const {
    draft,
    updateStep4,
    addItineraryDay,
    deleteItineraryDay,
    duplicateItineraryDay,
    moveItineraryDay,
  } = usePackageWizard();

  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const step4 = draft?.step4 || {
    days: [],
    activeDayId: 'day-1',
  };

  const days = step4.days || [];
  const activeDayId = step4.activeDayId || days[0]?.id || '';
  const activeDay = days.find((d) => d.id === activeDayId) || days[0];

  const handleSelectDay = (id: string) => {
    updateStep4({ activeDayId: id });
    setTimeout(() => {
      dayRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleUpdateActiveDay = (data: Partial<ItineraryDay>) => {
    if (!activeDay) return;
    const updatedDays = days.map((d) => (d.id === activeDay.id ? { ...d, ...data } : d));
    updateStep4({ days: updatedDays });
  };

  const validateDay = (day: ItineraryDay): boolean => {
    if (!day.title || day.title.trim().length === 0) {
      alert(`Please enter a Day Title for Day ${day.dayNumber}.`);
      return false;
    }
    if (!day.description || day.description.trim().length === 0) {
      alert(`Please enter a Description for Day ${day.dayNumber}.`);
      return false;
    }
    if (!day.activities || day.activities.length === 0) {
      alert(`Please add at least one activity for Day ${day.dayNumber}.`);
      return false;
    }
    return true;
  };

  const handleAddDayMobile = (currentDay: ItineraryDay) => {
    if (!validateDay(currentDay)) return;

    addItineraryDay();
    // Smooth scroll to the newly created day
    setTimeout(() => {
      const nextDays = draft?.step4?.days || [];
      const newCreatedDayId = nextDays[nextDays.length - 1]?.id;
      if (newCreatedDayId && dayRefs.current[newCreatedDayId]) {
        dayRefs.current[newCreatedDayId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const inactiveDays = days.filter((d) => d.id !== activeDay?.id);

  return (
    <div className="space-y-6 select-none">
      {/* 1. Package Summary Header Card */}
      <PackageSummaryHeader />

      {/* 2. Section Header */}
      <div className="space-y-1">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Itinerary Builder</h2>
        <p className="text-xs font-semibold text-slate-400">Build your day-by-day itinerary</p>
      </div>

      {/* Duration Mismatch Validation Warning */}
      {draft?.step2?.days && days.length !== draft.step2.days && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-black">
            !
          </div>
          <div>
            <h4 className="font-black text-amber-950">Itinerary Duration Mismatch</h4>
            <p className="text-[11px] font-semibold text-amber-800">
              Itinerary duration ({days.length} Days) does not match package duration ({draft.step2.days} Days). Please add or remove days to match package duration before publishing.
            </p>
          </div>
        </div>
      )}

      {/* ── 3A. MOBILE PROGRESSIVE ACCORDION FLOW (≤768px) ── */}
      <div className="block md:hidden space-y-3">
        {days.map((day) => {
          const isExpanded = day.id === activeDayId;

          return (
            <div
              key={day.id}
              ref={(el) => {
                dayRefs.current[day.id] = el;
              }}
              className="transition-all duration-300"
            >
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <DayEditor
                    day={day}
                    totalDays={days.length}
                    onUpdateDay={handleUpdateActiveDay}
                    onDuplicateDay={() => duplicateItineraryDay(day.id)}
                    onMoveUp={() => moveItineraryDay(day.id, 'up')}
                    onMoveDown={() => moveItineraryDay(day.id, 'down')}
                    onDeleteDay={() => deleteItineraryDay(day.id)}
                  />

                  {/* Progressive Add Day Button at bottom of expanded form */}
                  <button
                    type="button"
                    onClick={() => handleAddDayMobile(day)}
                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#583BE8] bg-purple-50/60 hover:bg-purple-100/60 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Day</span>
                  </button>
                </motion.div>
              ) : (
                <CollapsedDayCard day={day} onExpand={handleSelectDay} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── 3B. DESKTOP TWO-COLUMN LAYOUT (>768px) ── */}
      <div className="hidden md:flex items-start gap-5">
        {/* Left Column: Vertical Day Navigator */}
        <div className="shrink-0">
          <DayNavigator
            days={days}
            activeDayId={activeDay?.id || ''}
            onSelectDay={handleSelectDay}
            onAddDay={addItineraryDay}
          />
        </div>

        {/* Right Column: Active Day Editor & Remaining Collapsed Days */}
        <div className="flex-1 min-w-0 space-y-4">
          {activeDay && (
            <DayEditor
              day={activeDay}
              totalDays={days.length}
              onUpdateDay={handleUpdateActiveDay}
              onDuplicateDay={() => duplicateItineraryDay(activeDay.id)}
              onMoveUp={() => moveItineraryDay(activeDay.id, 'up')}
              onMoveDown={() => moveItineraryDay(activeDay.id, 'down')}
              onDeleteDay={() => deleteItineraryDay(activeDay.id)}
            />
          )}

          {/* Collapsed Inactive Days Cards (Desktop) */}
          {inactiveDays.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-extrabold text-slate-400 px-1">Other Days</p>
              {inactiveDays.map((d) => (
                <CollapsedDayCard key={d.id} day={d} onExpand={handleSelectDay} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryStep;
