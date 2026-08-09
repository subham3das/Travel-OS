import React, { useState } from 'react';
import { MoreVertical, CheckCircle, EyeOff, Trash2, Archive, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgencyNotification } from '../../data/notifications';
import { NotificationIcon } from './NotificationIcon';

interface NotificationCardProps {
  notification: AgencyNotification;
  onSelect: (notification: AgencyNotification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onSelect,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onArchive,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Helper to format hashtags (#BK-20391, #TRIP-0826) with blue/purple styling
  const renderFormattedDescription = (text: string) => {
    const parts = text.split(/(#[A-Z0-9-]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <strong key={index} className="font-extrabold text-[#583BE8]">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
    if (notification.ctaLink) {
      navigate(notification.ctaLink);
    } else {
      onSelect(notification);
    }
  };

  return (
    <div
      onClick={() => onSelect(notification)}
      className={`group relative p-4 transition-all duration-200 cursor-pointer select-none border-b border-slate-100/70 last:border-b-0 hover:bg-slate-50/70 ${
        notification.isUnread ? 'bg-purple-50/30' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Left timeline status dot */}
        <div className="pt-3.5 shrink-0">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              notification.isUnread
                ? 'bg-[#583BE8] ring-4 ring-purple-100 animate-pulse'
                : 'bg-slate-300'
            }`}
          />
        </div>

        {/* Category Icon */}
        <NotificationIcon category={notification.category} />

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-xs sm:text-sm tracking-tight truncate ${
                notification.isUnread ? 'font-black text-[#0F172A]' : 'font-extrabold text-slate-700'
              }`}
            >
              {notification.title}
            </h4>

            {/* Timestamp & Unread Dot */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-slate-400">
                {notification.timestamp}
              </span>

              {notification.isUnread && (
                <span className="w-2 h-2 rounded-full bg-[#583BE8] shrink-0" />
              )}
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed pr-6">
            {renderFormattedDescription(notification.description)}
          </p>

          {/* Optional CTA Button */}
          {notification.ctaText && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCtaClick}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#583BE8] text-[#583BE8] hover:text-white text-[11px] font-black transition-all inline-flex items-center gap-1.5 shadow-2xs border border-purple-200/60 cursor-pointer"
              >
                <span>{notification.ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action Options Dropdown Menu */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
              {notification.isUnread ? (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAsRead(notification.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark as Read</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAsUnread(notification.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Mark as Unread</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onArchive(notification.id);
                  setShowMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(notification.id);
                  setShowMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
