import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { BookingTimelineItem } from '../../data/bookings';

interface BookingTimelineProps {
  timeline: BookingTimelineItem[];
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ timeline }) => {
  return (
    <div className="space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Booking Timeline
      </h4>

      <div className="relative pl-6 space-y-4">
        {/* Connecting Vertical Line */}
        <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-slate-200" />

        {timeline.map((item, idx) => (
          <div key={idx} className="relative flex items-start gap-3">
            {/* Step Icon */}
            <div className="absolute -left-6 top-0.5 z-10 bg-white">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#583BE8] fill-purple-50" />
              ) : item.active ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#583BE8] bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#583BE8]" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-slate-300 fill-white" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-black ${
                  item.completed || item.active ? 'text-[#0F172A]' : 'text-slate-400'
                }`}
              >
                {item.title}
              </p>
              {item.timestamp && (
                <p className="text-[10px] font-semibold text-slate-400">{item.timestamp}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline;
