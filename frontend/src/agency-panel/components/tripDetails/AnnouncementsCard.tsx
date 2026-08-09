import React from 'react';
import { Megaphone } from 'lucide-react';
import { TripAnnouncement } from '../../data/tripDetails';

interface AnnouncementsCardProps {
  announcements: TripAnnouncement[];
  onViewAll?: () => void;
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({
  announcements,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Announcements</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100/80 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#583BE8] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Megaphone className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0F172A] leading-snug">{anc.message}</p>
              <span className="text-[10px] font-semibold text-slate-400 block">
                {anc.dateText}, {anc.timeText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsCard;
