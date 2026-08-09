import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Conversation } from '../../data/inbox';

interface ChatHeaderProps {
  conversation: Conversation;
  onBackMobile: () => void;
  onToggleInfoPanel: () => void;
  isInfoPanelOpen: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBackMobile,
  onToggleInfoPanel,
  isInfoPanelOpen,
}) => {
  return (
    <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          type="button"
          onClick={onBackMobile}
          className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-extrabold cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Customer Avatar & Name */}
        <div className="relative shrink-0">
          <img
            src={conversation.customerAvatar}
            alt={conversation.customerName}
            className="w-10 h-10 rounded-full object-cover border border-purple-100"
          />
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[#0F172A] truncate">{conversation.customerName}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {conversation.customerInfo.paymentStatus}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            {conversation.tripName} • Booking: {conversation.bookingId}
          </p>
        </div>
      </div>


    </div>
  );
};

export default ChatHeader;
