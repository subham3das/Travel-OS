import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Heart,
  MessageSquare,
  Star,
  FileText,
  User,
  Megaphone,
  Camera,
  Calendar,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { NotificationItem } from '../../../data/notifications';

interface NotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.iconType) {
      case 'check':
        return <Check className="w-5 h-5 stroke-[2.5]" />;
      case 'heart':
        return <Heart className="w-5 h-5 fill-current" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 fill-current" />;
      case 'star':
        return <Star className="w-5 h-5 fill-current" />;
      case 'file':
        return <FileText className="w-5 h-5" />;
      case 'user':
        return <User className="w-5 h-5" />;
      case 'megaphone':
        return <Megaphone className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'bell':
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      onClick={() => onClick(notification)}
      whileTap={{ scale: 0.99 }}
      className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer group"
    >
      {/* Unread Purple Indicator Dot */}
      <div className="w-2 flex justify-center shrink-0">
        {!notification.isRead && (
          <span className="w-2 h-2 rounded-full bg-[#6356E5] animate-pulse" />
        )}
      </div>

      {/* Circle Icon */}
      <div
        className={`w-11 h-11 rounded-full ${notification.iconBgColor} flex items-center justify-center shrink-0 shadow-xs`}
      >
        {getIcon()}
      </div>

      {/* Main Text Content */}
      <div className="flex-1 min-w-0 pr-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm tracking-tight truncate ${
              notification.isRead ? 'font-bold text-slate-800' : 'font-black text-[#0F172A]'
            }`}
          >
            {notification.title}
          </h4>

          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            {notification.timestamp}
          </span>
        </div>

        <p className="text-xs font-medium text-slate-500 leading-snug line-clamp-2">
          {notification.highlightText ? (
            <>
              {notification.description.split(notification.highlightText)[0]}
              <span className="font-bold text-[#6356E5]">{notification.highlightText}</span>
              {notification.description.split(notification.highlightText)[1]}
            </>
          ) : (
            notification.description
          )}
        </p>
      </div>

      {/* Right Thumbnail or Avatar */}
      {notification.thumbnailUrl && (
        <div className="w-12 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
          <img
            src={notification.thumbnailUrl}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {notification.avatarUrl && (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
          <img
            src={notification.avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Right Chevron */}
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
    </motion.div>
  );
};
