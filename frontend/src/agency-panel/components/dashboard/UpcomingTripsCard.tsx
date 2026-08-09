import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UpcomingTripSummaryItem } from '../../data/dashboardInsights';

interface UpcomingTripsCardProps {
  items: UpcomingTripSummaryItem[];
  onSelect?: (item: UpcomingTripSummaryItem) => void;
}

export const UpcomingTripsCard: React.FC<UpcomingTripsCardProps> = ({ items, onSelect }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex flex-col justify-between">
      <div className="w-full text-left">
        <span className="text-xs font-bold text-slate-500">Upcoming Trips</span>
      </div>

      <div className="space-y-3.5 pt-1">
        {items.map((item, idx) => {
          const colors = [
            'bg-purple-100 text-[#583BE8]',
            'bg-sky-100 text-sky-600',
            'bg-emerald-100 text-emerald-600',
          ];
          const badgeColor = colors[idx % colors.length];

          return (
            <div
              key={item.label}
              onClick={() => onSelect && onSelect(item)}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${badgeColor}`}
                >
                  {item.count}
                </div>
                <div>
                  <p className="text-xs font-black text-[#0F172A]">{item.label}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{item.tripText}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingTripsCard;
