import React from 'react';
import { Check, Luggage, Plane, Flag } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface TripTimelineProps {
  trip: Trip;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ trip }) => {
  const steps = [
    { title: 'Booking Confirmed', date: '12 May, 2025', icon: <Check className="w-3.5 h-3.5 text-white stroke-[3]" />, status: 'completed' },
    { title: 'Agency Preparing', date: 'In Progress', icon: <Luggage className="w-3.5 h-3.5 text-white" />, status: 'current' },
    { title: 'Trip Starts', date: trip.tripStartDate, icon: <Plane className="w-3.5 h-3.5 text-white" />, status: 'upcoming' },
    { title: 'Trip Ends', date: trip.tripEndDate, icon: <Flag className="w-3.5 h-3.5 text-slate-500" />, status: 'upcoming' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Trip Timeline
      </h2>

      <div className="relative pt-2 pb-1 px-4">
        {/* Background Connecting Line aligned through middle center of circular icons (top-4) */}
        <div className="absolute top-4 left-10 right-10 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
        <div className="absolute top-4 left-10 w-1/3 h-[2px] bg-emerald-500 -translate-y-1/2 z-0" />

        <div className="relative z-10 flex items-start justify-between">
          {steps.map((s, idx) => {
            let bgClass = 'bg-slate-200 border-slate-300 text-slate-400';
            if (s.status === 'completed') bgClass = 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20';
            if (s.status === 'current') bgClass = 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/25 ring-4 ring-[#6356E5]/15';
            if (s.title === 'Trip Starts') bgClass = 'bg-amber-500 text-white shadow-md shadow-amber-500/20';

            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-2 max-w-[90px]">
                {/* Smaller Circle Icon (w-8 h-8) */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${bgClass}`}>
                  {s.icon}
                </div>

                <div>
                  <p className="text-[11px] font-extrabold text-[#0F172A] leading-tight">{s.title}</p>
                  <p className="text-[10px] font-semibold text-slate-400 pt-0.5">{s.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
