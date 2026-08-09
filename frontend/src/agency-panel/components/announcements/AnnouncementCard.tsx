import React from 'react';
import {
  TripAnnouncement,
  getAnnouncementEmoji,
  getStatusColor,
  formatAnnouncementTime,
} from '../../data/announcements';

interface AnnouncementCardProps {
  announcement: TripAnnouncement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const { date, time } = formatAnnouncementTime(announcement.createdAt);
  const emoji = getAnnouncementEmoji(announcement.type);
  const statusCls = getStatusColor(announcement.status);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      {/* Type Emoji Badge */}
      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-base mt-0.5">
        {emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h5 className="text-xs font-extrabold text-[#0F172A] truncate">{announcement.title}</h5>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusCls}`}>
            {announcement.status}
          </span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500 line-clamp-2 leading-snug">
          {announcement.message}
        </p>
        <p className="text-[10px] font-semibold text-slate-400">
          {date} • {time} · By {announcement.author}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementCard;
