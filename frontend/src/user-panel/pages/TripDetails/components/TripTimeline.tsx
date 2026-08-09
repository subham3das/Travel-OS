import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, AlertTriangle, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Trip, TimelineMilestone } from '../../../data/trips';

interface TripTimelineProps {
  trip: Trip;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ trip }) => {
  const milestones: TimelineMilestone[] = trip.timeline || [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Live Trip Timeline
          </h2>
          <p className="text-[11px] font-semibold text-slate-400">
            Real-time activity updates & daily itinerary progression
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-50 text-[#583BE8] text-xs font-black border border-purple-100 shadow-2xs">
          {trip.duration}
        </span>
      </div>

      {/* Daily Milestones */}
      <div className="space-y-4">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border space-y-3 transition-all ${
              m.status === 'completed'
                ? 'bg-emerald-50/40 border-emerald-200/80'
                : m.status === 'current'
                ? 'bg-purple-50/50 border-purple-200 ring-2 ring-[#583BE8]/10'
                : 'bg-slate-50/60 border-slate-200/60 opacity-80'
            }`}
          >
            {/* Header: Day Number & Status */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                  m.status === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : m.status === 'current'
                    ? 'bg-[#583BE8] text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}>
                  D{m.dayNumber}
                </span>

                <h3 className="text-xs sm:text-sm font-black text-[#0F172A]">{m.title}</h3>
              </div>

              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                m.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : m.status === 'current'
                  ? 'bg-purple-100 text-[#583BE8]'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {m.status}
              </span>
            </div>

            <p className="text-xs font-medium text-slate-600 leading-relaxed pl-9">
              {m.description}
            </p>

            {/* Current Activity Highlight */}
            {m.currentActivity && (
              <div className="ml-9 p-2.5 rounded-xl bg-purple-100/80 border border-purple-200 text-xs font-extrabold text-[#583BE8] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Now In Progress: {m.currentActivity}</span>
              </div>
            )}

            {/* Activities List */}
            <div className="ml-9 space-y-1 text-xs">
              {m.completedActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}

              {m.upcomingActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>

            {/* Shared Trip Notes / Notices */}
            {m.tripNote && (
              <div className="ml-9 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-extrabold text-[#583BE8] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Agency Host Note
                </span>
                <p className="font-medium text-slate-600 leading-relaxed">{m.tripNote}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripTimeline;
