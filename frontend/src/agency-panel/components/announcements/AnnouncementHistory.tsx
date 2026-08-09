import React from 'react';
import { TripAnnouncement } from '../../data/announcements';
import { AnnouncementCard } from './AnnouncementCard';

interface AnnouncementHistoryProps {
  announcements: TripAnnouncement[];
  maxVisible?: number;
  onViewAll?: () => void;
}

export const AnnouncementHistory: React.FC<AnnouncementHistoryProps> = ({
  announcements,
  maxVisible = 5,
  onViewAll,
}) => {
  const visible = announcements.slice(0, maxVisible);

  if (visible.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs font-semibold text-slate-400">No announcements sent yet for this trip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-slate-100/80">
      {visible.map((a) => (
        <AnnouncementCard key={a.id} announcement={a} />
      ))}

      {announcements.length > maxVisible && (
        <div className="pt-3 text-center">
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
          >
            View all {announcements.length} announcements
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementHistory;
