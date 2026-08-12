import React from 'react';
import { TimelineEvent } from '../../../types/agencyRequest';

interface ApplicationTimelineProps {
  timeline: TimelineEvent[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ timeline }) => {
  const defaultTimeline: TimelineEvent[] = [
    { id: '1', title: 'Application Submitted', timestamp: 'May 21, 2024 10:30 AM', completed: true, color: 'bg-emerald-500' },
    { id: '2', title: 'Documents Uploaded', timestamp: 'May 21, 2024 10:45 AM', completed: true, color: 'bg-emerald-500' },
    { id: '3', title: 'Verification Started', timestamp: 'May 21, 2024 11:20 AM', completed: true, color: 'bg-amber-500' },
    { id: '4', title: 'Admin Viewed', timestamp: 'May 21, 2024 12:15 PM', completed: true, color: 'bg-blue-500' },
    { id: '5', title: 'Pending Approval', timestamp: '—', completed: false, color: 'bg-slate-300' },
  ];

  const events = timeline && timeline.length > 0 ? timeline : defaultTimeline;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Application Timeline
      </h4>

      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex items-start justify-between gap-2 text-xs">
            <span
              className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-2xs ${
                evt.completed ? evt.color || 'bg-[#6356E5]' : 'bg-slate-300'
              }`}
            />
            <span
              className={`font-bold ${
                evt.completed ? 'text-[#0F172A]' : 'text-slate-400 font-semibold'
              }`}
            >
              {evt.title}
            </span>
            <span className="text-[10px] font-bold text-slate-400 shrink-0">
              {evt.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
