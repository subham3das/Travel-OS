import React from 'react';
import { CheckCheck, Trash, Bell } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onMarkAllRead: () => void;
  onClearAllRead: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  unreadCount,
  onMarkAllRead,
  onClearAllRead,
}) => {
  return (
    <div className="space-y-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-2xs">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              Stay updated with your agency activities
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="px-3 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50 hover:text-[#583BE8] text-slate-700 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Mark all notifications as read"
          >
            <CheckCheck className="w-4 h-4 text-[#583BE8]" />
            <span>Mark All Read</span>
          </button>

          <button
            type="button"
            onClick={onClearAllRead}
            className="px-3 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Clear all read notifications"
          >
            <Trash className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Clear Read</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsHeader;
