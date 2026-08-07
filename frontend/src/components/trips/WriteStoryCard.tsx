import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Edit3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WriteStoryCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-amber-50/80 p-6 sm:p-8 border border-rose-100/80 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-3 max-w-lg text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share Your Journey</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Inspire fellow travelers with your story
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Published stories earn ApnaTrip badges and unlock travel rewards!
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/community')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#e03d5c] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FF4D6D]/20 transition-all shrink-0 focus:outline-none"
        >
          <Edit3 className="w-4 h-4" />
          <span>Write Story</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
