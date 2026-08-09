import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, SkipForward, ShieldCheck } from 'lucide-react';
import { DayLiveStatus, TripLiveStatus } from '../../data/tripTimeline';

interface DayStatusBadgeProps {
  status: DayLiveStatus;
  size?: 'sm' | 'md';
}

export const TimelineStatusBadge: React.FC<DayStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'Completed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'}`}>
          <CheckCircle2 className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600`} />
          Completed
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-extrabold animate-pulse ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'}`}>
          <PlayCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-sky-600`} />
          In Progress
        </span>
      );
    case 'Delayed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-extrabold ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'}`}>
          <AlertTriangle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-600`} />
          Delayed
        </span>
      );
    case 'Skipped':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 font-extrabold ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'}`}>
          <SkipForward className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-rose-600`} />
          Skipped
        </span>
      );
    case 'Not Started':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-extrabold ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'}`}>
          <Clock className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-400`} />
          Not Started
        </span>
      );
  }
};

interface TripStatusBadgeProps {
  status: TripLiveStatus;
}

export const TripLiveStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Ongoing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white font-black text-xs shadow-md shadow-sky-500/20 animate-pulse">
          <PlayCircle className="w-3.5 h-3.5" />
          ONGOING TRIP
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-600/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          TRIP COMPLETED
        </span>
      );
    case 'Upcoming':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#583BE8] border border-purple-200 font-black text-xs">
          <Clock className="w-3.5 h-3.5" />
          UPCOMING
        </span>
      );
    case 'Pending Setup':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-black text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          PENDING SETUP
        </span>
      );
  }
};

export default TimelineStatusBadge;
