import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, ExternalLink } from 'lucide-react';

export const TripChatPlaceholder: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#583BE8]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Trip Communication</h3>
            <p className="text-[11px] font-semibold text-slate-400">Live chat between travelers & agency host</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/agency/messages')}
          className="text-xs font-extrabold text-[#583BE8] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>Open DM Center</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50/60 via-slate-50 to-purple-50/40 border border-purple-100/60 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-white text-[#583BE8] flex items-center justify-center mx-auto shadow-xs">
          <MessageSquare className="w-5 h-5" />
        </div>
        <p className="text-xs font-extrabold text-[#0F172A]">Real-Time Group Chat & Broadcast Channel</p>
        <p className="text-[11px] font-semibold text-slate-400 max-w-md mx-auto">
          Direct messaging between agency team, tour guides, and all 18 enrolled travelers is active in the Customer DM Center.
        </p>
        <button
          type="button"
          onClick={() => navigate('/agency/messages')}
          className="mt-2 px-4 py-2 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Launch Traveler Chat</span>
        </button>
      </div>
    </motion.div>
  );
};

export default TripChatPlaceholder;
