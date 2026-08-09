import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ChatConversation } from '../../../data/chats';

interface ChatCardProps {
  chat: ChatConversation;
  onClick: (chat: ChatConversation) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({ chat, onClick }) => {
  return (
    <motion.div
      onClick={() => onClick(chat)}
      whileTap={{ scale: 0.99 }}
      className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer group"
    >
      {/* Agency Logo with Online Dot */}
      <div className="relative shrink-0">
        <img
          src={chat.agencyLogo}
          alt={chat.agencyName}
          className="w-12 h-12 rounded-full object-cover border border-slate-100 bg-slate-100"
        />
        {chat.isOnline && (
          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-2xs" />
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-sm font-black text-[#0F172A] tracking-tight truncate">
              {chat.agencyName}
            </h4>
            {chat.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-[#6356E5] fill-[#6356E5]/10 shrink-0" />
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            {chat.lastMessageTime}
          </span>
        </div>

        <p className="text-xs font-medium text-slate-500 truncate leading-tight">
          {chat.lastMessage}
        </p>

        {/* Booking ID Tag Pill */}
        {chat.bookingId && (
          <div className="pt-0.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[11px] font-bold">
              Booking ID: {chat.bookingId}
            </span>
          </div>
        )}
      </div>

      {/* Unread Count Circle Badge */}
      {chat.unreadCount > 0 && (
        <div className="shrink-0 pl-1">
          <span className="w-5 h-5 rounded-full bg-[#6356E5] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
            {chat.unreadCount}
          </span>
        </div>
      )}
    </motion.div>
  );
};
