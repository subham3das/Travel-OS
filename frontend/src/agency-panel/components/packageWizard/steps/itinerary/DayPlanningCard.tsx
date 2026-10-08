import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import { ItineraryDay, ItineraryPlanItem } from '../../../../types/itinerary';

interface DayPlanningCardProps {
  day: ItineraryDay;
  totalDays: number;
  onUpdateDay: (updated: Partial<ItineraryDay>) => void;
  onDuplicateDay: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteDay: () => void;
  onAddPlan: (dayId: string, text?: string) => void;
  onUpdatePlan: (dayId: string, planId: string, updated: Partial<ItineraryPlanItem>) => void;
  onRemovePlan: (dayId: string, planId: string) => void;
  onMovePlan: (dayId: string, planId: string, direction: 'up' | 'down') => void;
}

export const DayPlanningCard: React.FC<DayPlanningCardProps> = ({
  day,
  totalDays,
  onUpdateDay,
  onDuplicateDay,
  onMoveUp,
  onMoveDown,
  onDeleteDay,
  onAddPlan,
  onUpdatePlan,
  onRemovePlan,
  onMovePlan,
}) => {
  const [showDescription, setShowDescription] = useState(Boolean(day.description && day.description.trim().length > 0));
  const planInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const plans = day.plans || [];

  const handleAddPlanClick = () => {
    const tempId = `plan-new-${Date.now()}`;
    onAddPlan(day.id, '');
    setTimeout(() => {
      // Focus the last input
      const inputs = Object.values(planInputRefs.current).filter(Boolean);
      if (inputs.length > 0) {
        inputs[inputs.length - 1]?.focus();
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, planId: string, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddPlan(day.id, '');
      setTimeout(() => {
        const inputs = Object.values(planInputRefs.current).filter(Boolean);
        if (inputs.length > index + 1) {
          inputs[index + 1]?.focus();
        } else if (inputs.length > 0) {
          inputs[inputs.length - 1]?.focus();
        }
      }, 50);
    } else if (e.key === 'Backspace' && e.currentTarget.value === '' && plans.length > 1) {
      e.preventDefault();
      onRemovePlan(day.id, planId);
      setTimeout(() => {
        const prevIndex = Math.max(0, index - 1);
        const inputs = Object.values(planInputRefs.current).filter(Boolean);
        inputs[prevIndex]?.focus();
      }, 50);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5 transition-all">
      {/* Top Header: Day Badge & Day Actions */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-purple-50 text-[#583BE8] text-xs font-black tracking-wide uppercase border border-purple-100/80">
            DAY {day.dayNumber}
          </span>
          <span className="text-xs font-bold text-slate-400">
            ({plans.length} {plans.length === 1 ? 'plan' : 'plans'})
          </span>
        </div>

        {/* Day Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={day.dayNumber === 1}
            onClick={onMoveUp}
            title="Move Day Up"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={day.dayNumber === totalDays}
            onClick={onMoveDown}
            title="Move Day Down"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDuplicateDay}
            title="Duplicate Day"
            className="p-1.5 text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeleteDay}
            title="Delete Day"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Title Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={day.title}
          onChange={(e) => onUpdateDay({ title: e.target.value })}
          placeholder="e.g. Arrival in Leh & Acclimatization"
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Description (Optional) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="text-xs font-extrabold text-slate-500 hover:text-[#583BE8] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Description</span>
            <span className="text-[10px] font-bold text-slate-400">(Optional)</span>
          </button>

          {showDescription && (
            <button
              type="button"
              onClick={() => {
                setShowDescription(false);
                onUpdateDay({ description: '' });
              }}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>

        {showDescription && (
          <textarea
            rows={2}
            value={day.description || ''}
            onChange={(e) => onUpdateDay({ description: e.target.value })}
            placeholder="e.g. High altitude day. Drink plenty of water and rest before evening walks."
            className="w-full p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs font-medium text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all resize-none placeholder:text-slate-300"
          />
        )}
      </div>

      {/* Today's Plan Checklist */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
            Today's Plan
          </label>
          <span className="text-[11px] font-bold text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-black border border-slate-200">Enter</kbd> to add next
          </span>
        </div>

        {/* List of Plan Items */}
        <div className="space-y-2">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="group flex items-center gap-2 p-2 px-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-all"
            >
              {/* Drag/Reorder grip icon */}
              <div className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Bullet / Checkbox mark */}
              <div className="w-4 h-4 rounded-md border-2 border-slate-300 group-hover:border-[#583BE8] flex items-center justify-center shrink-0 transition-colors">
                <div className="w-1.5 h-1.5 rounded-xs bg-[#583BE8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Plan Text Input */}
              <input
                ref={(el) => {
                  planInputRefs.current[plan.id] = el;
                }}
                type="text"
                value={plan.text}
                onChange={(e) => onUpdatePlan(day.id, plan.id, { text: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, plan.id, index)}
                placeholder="e.g. Airport Pickup"
                className="flex-1 bg-transparent text-xs font-extrabold text-[#0F172A] focus:outline-none placeholder:text-slate-300"
              />

              {/* Item Reorder Controls */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMovePlan(day.id, plan.id, 'up')}
                  title="Move Up"
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={index === plans.length - 1}
                  onClick={() => onMovePlan(day.id, plan.id, 'down')}
                  title="Move Down"
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemovePlan(day.id, plan.id)}
                  title="Delete Plan"
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Plan Button */}
        <button
          type="button"
          onClick={handleAddPlanClick}
          className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-[#583BE8]/60 bg-purple-50/50 hover:bg-purple-100/60 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none active:scale-99"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Plan</span>
        </button>
      </div>
    </div>
  );
};

export default DayPlanningCard;
