import React, { useState } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';
import { ItineraryDay } from '../../../../types/itinerary';
import { ActivityTimeline } from './ActivityTimeline';
import { MealsSelector } from './MealsSelector';
import { StaySelector } from './StaySelector';
import { TransportSelector } from './TransportSelector';
import { DayImageUploader } from './DayImageUploader';
import { NotesSection } from './NotesSection';
import { DayActionBar } from './DayActionBar';

interface DayEditorProps {
  day: ItineraryDay;
  totalDays: number;
  onUpdateDay: (updated: Partial<ItineraryDay>) => void;
  onDuplicateDay: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteDay: () => void;
}

export const DayEditor: React.FC<DayEditorProps> = ({
  day,
  totalDays,
  onUpdateDay,
  onDuplicateDay,
  onMoveUp,
  onMoveDown,
  onDeleteDay,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 select-none">
      {/* Header: Day Number & Editable Title */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5 min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase text-[#583BE8] tracking-wider">
            Day {day.dayNumber}
          </p>

          {isEditingTitle ? (
            <div className="flex items-center gap-2 max-w-sm pt-1">
              <input
                type="text"
                value={day.title}
                onChange={(e) => onUpdateDay({ title: e.target.value })}
                className="w-full text-base sm:text-lg font-black text-[#0F172A] border-b-2 border-[#583BE8] focus:outline-none bg-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="p-1 text-[#583BE8] hover:bg-purple-50 rounded-lg cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] truncate">
                {day.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="p-1 text-slate-400 hover:text-[#583BE8] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDeleteDay}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer shrink-0"
          aria-label="Delete Day"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-[#0F172A]">Description</label>
          <span className="text-[10px] font-bold text-slate-400">
            {day.description.length}/500
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={day.description}
          onChange={(e) => onUpdateDay({ description: e.target.value })}
          placeholder="Describe today's experience..."
          className="w-full p-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#583BE8] resize-none"
        />
      </div>

      {/* Activities & Timeline */}
      <ActivityTimeline
        activities={day.activities}
        onChange={(activities) => onUpdateDay({ activities })}
      />

      {/* Meals & Stay Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MealsSelector
          meals={day.meals}
          onChange={(meals) => onUpdateDay({ meals })}
        />
        <StaySelector
          stay={day.stay}
          onChange={(stay) => onUpdateDay({ stay })}
        />
      </div>

      {/* Transportation */}
      <TransportSelector
        transportation={day.transportation}
        onChange={(transportation) => onUpdateDay({ transportation })}
      />

      {/* Day Image & Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DayImageUploader
          image={day.image}
          onChange={(image) => onUpdateDay({ image })}
        />
        <NotesSection
          value={day.notes}
          onChange={(notes) => onUpdateDay({ notes })}
        />
      </div>

      {/* Day Action Buttons */}
      <DayActionBar
        dayNumber={day.dayNumber}
        totalDays={totalDays}
        onDuplicate={onDuplicateDay}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDeleteDay}
      />
    </div>
  );
};

export default DayEditor;
