import React from 'react';
import { motion } from 'framer-motion';
import { Conversation } from '../../data/inbox';

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`p-3.5 sm:p-4 rounded-3xl border transition-all cursor-pointer select-none space-y-2 ${
        isSelected
          ? 'bg-purple-50/70 border-[#583BE8]/60 shadow-md ring-2 ring-[#583BE8]/10'
          : 'bg-white border-slate-100/90 hover:border-purple-200 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar & Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={conversation.customerAvatar}
              alt={conversation.customerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-[#0F172A] truncate">
                {conversation.customerName}
              </h3>
              {conversation.customerInfo.isVIP && (
                <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                  VIP
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#583BE8]">
              <span className="bg-purple-100 px-2 py-0.5 rounded-md">
                Booking ID: {conversation.bookingId}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-bold truncate">{conversation.tripName}</span>
            </div>

            <p className={`text-xs truncate font-medium ${conversation.unreadCount > 0 ? 'font-bold text-[#0F172A]' : 'text-slate-500'}`}>
              {conversation.lastMessage}
            </p>
          </div>
        </div>

        {/* Right: Time & Unread Badge */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-400">{conversation.lastMessageTime}</span>

          {conversation.unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#583BE8] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationCard;
