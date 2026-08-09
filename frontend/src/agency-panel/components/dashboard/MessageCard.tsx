import React from 'react';
import { AgencyPendingMessage } from '../../data/dashboard';

interface MessageCardProps {
  message: AgencyPendingMessage;
  onClick?: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
    >
      {/* Left: Avatar & Text Snippet */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <img
          src={message.travelerAvatar}
          alt={message.travelerName}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
        />

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
              {message.travelerName}
            </h4>
            <span className="text-[10px] font-medium text-slate-400 shrink-0">{message.timeText}</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 truncate">
            {message.messageSnippet}
          </p>
        </div>
      </div>

      {/* Right: Unread Badge */}
      {message.unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-[#583BE8] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs">
          {message.unreadCount}
        </div>
      )}
    </div>
  );
};

export default MessageCard;
