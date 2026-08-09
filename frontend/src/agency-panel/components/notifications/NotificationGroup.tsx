import React from 'react';
import { AgencyNotification } from '../../data/notifications';
import { NotificationCard } from './NotificationCard';

interface NotificationGroupProps {
  dateGroup: string;
  items: AgencyNotification[];
  onSelect: (notification: AgencyNotification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  dateGroup,
  items,
  onSelect,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onArchive,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 select-none">
      {/* Sticky Section Heading */}
      <div className="sticky top-[68px] z-10 bg-[#FBFBFE]/95 backdrop-blur-md py-1.5 px-1">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {dateGroup}
        </h3>
      </div>

      {/* White Rounded Card Group Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {items.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onSelect={onSelect}
            onMarkAsRead={onMarkAsRead}
            onMarkAsUnread={onMarkAsUnread}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationGroup;
