import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  User,
  Hotel,
  Bus,
  Utensils,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { TimelineDay, DayLiveStatus } from '../../data/tripTimeline';
import { TimelineStatusBadge } from './TimelineStatusBadge';
import { DailyChecklist } from './DailyChecklist';

interface TimelineDayCardProps {
  day: TimelineDay;
  isCurrentDay?: boolean;
  onUpdateDayStatus: (dayNumber: number, newStatus: DayLiveStatus) => void;
  onToggleChecklistItem: (dayNumber: number, itemId: string) => void;
  onUpdateActivityStatus: (dayNumber: number, activityId: string, newStatus: DayLiveStatus) => void;
}

export const TimelineDayCard: React.FC<TimelineDayCardProps> = ({
  day,
  isCurrentDay = false,
  onUpdateDayStatus,
  onToggleChecklistItem,
  onUpdateActivityStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(isCurrentDay || day.status === 'In Progress');

  const STATUS_OPTIONS: DayLiveStatus[] = ['Not Started', 'In Progress', 'Completed', 'Delayed', 'Skipped'];

  return (
    <div className="relative pl-6 sm:pl-8 select-none">
      {/* Vertical Timeline Connection Line */}
      <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-0 w-0.5 bg-slate-200" />

      {/* Timeline Node Icon / Dot */}
      <div
        className={`absolute left-0 top-6 w-5 h-5 sm:w-7 sm:h-7 rounded-full border-4 border-white flex items-center justify-center shadow-sm shrink-0 z-10 ${
          day.status === 'Completed'
            ? 'bg-emerald-500 text-white'
            : day.status === 'In Progress'
            ? 'bg-sky-500 text-white ring-4 ring-sky-100 animate-pulse'
            : day.status === 'Delayed'
            ? 'bg-amber-500 text-white'
            : day.status === 'Skipped'
            ? 'bg-rose-500 text-white'
            : 'bg-slate-300 text-white'
        }`}
      >
        <span className="text-[10px] font-black">{day.dayNumber}</span>
      </div>

      {/* Day Card Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border transition-all ${
          isCurrentDay || day.status === 'In Progress'
            ? 'bg-white border-[#583BE8]/40 shadow-[0_8px_30px_rgba(88,59,232,0.08)] ring-2 ring-[#583BE8]/10'
            : day.status === 'Completed'
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-white border-slate-200/70 shadow-2xs'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-[#583BE8] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  Day {day.dayNumber}
                </span>
                <span className="text-xs font-semibold text-slate-400">{day.dateText}</span>
                {isCurrentDay && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Today
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">{day.title}</h3>
            </div>

            {/* Status Dropdown & Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={day.status}
                onChange={(e) => onUpdateDayStatus(day.dayNumber, e.target.value as DayLiveStatus)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[#0F172A] focus:outline-none focus:border-[#583BE8] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#583BE8] flex items-center justify-center transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Summary Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-bold text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
              <span>Pickup: {day.pickupTime}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Guide: {day.guideName}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Hotel className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{day.hotelName}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{day.vehicleName}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details Body */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-100 bg-slate-50/40"
            >
              <div className="p-4 sm:p-5 space-y-5">
                {/* 1. Schedule & Timings Grid */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Pickup Time</span>
                    <span className="font-black text-[#0F172A]">{day.pickupTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Departure</span>
                    <span className="font-black text-[#0F172A]">{day.departureTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Est. Arrival</span>
                    <span className="font-black text-[#0F172A]">{day.arrivalTime}</span>
                  </div>
                </div>

                {/* 2. Activity Schedule */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#583BE8]" />
                    Activity Schedule ({day.activities.length} Events)
                  </h4>

                  <div className="space-y-2">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-black text-[#583BE8] bg-purple-50 px-2 py-1 rounded-xl shrink-0 text-[11px]">
                            {act.time}
                          </span>
                          <div className="min-w-0">
                            <p className="font-extrabold text-[#0F172A] truncate">{act.title}</p>
                            {act.location && (
                              <p className="text-[10px] text-slate-400 font-semibold truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {act.location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Individual Activity Status update */}
                        <select
                          value={act.status}
                          onChange={(e) => onUpdateActivityStatus(day.dayNumber, act.id, e.target.value as DayLiveStatus)}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer shrink-0"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Meals & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-100 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-500" /> Meals Plan
                    </span>
                    <p className="font-bold text-[#0F172A]">{day.meals}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-100 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#583BE8]" /> Day Notes & Advice
                    </span>
                    <p className="font-bold text-slate-600">{day.notes}</p>
                  </div>
                </div>

                {/* 4. Daily Checklist Component */}
                <DailyChecklist
                  dayNumber={day.dayNumber}
                  items={day.checklist}
                  onToggleItem={(itemId) => onToggleChecklistItem(day.dayNumber, itemId)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TimelineDayCard;
