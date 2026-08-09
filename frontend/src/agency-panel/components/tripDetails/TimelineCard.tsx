import React from 'react';
import { Calendar, CheckCircle2, Bus } from 'lucide-react';
import { TripTimelineEvent } from '../../data/tripDetails';

interface TimelineCardProps {
  events: TripTimelineEvent[];
  onViewAll?: () => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ events, onViewAll }) => {
  const getIcon = (type: TripTimelineEvent['iconType']) => {
    switch (type) {
      case 'created':
        return <Calendar className="w-3.5 h-3.5 text-emerald-600" />;
      case 'confirmed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'assigned':
        return <Bus className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Trip Timeline</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-center gap-3 text-xs">
            <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              {getIcon(evt.iconType)}
            </div>

            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 w-32 shrink-0">
                {evt.timestamp}
              </span>
              <span className="font-extrabold text-[#0F172A] truncate flex-1 text-right sm:text-left">
                {evt.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
