import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, CheckCircle } from 'lucide-react';

export const AskAICard: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleClick = () => {
    setToastMessage('✨ Opening AI Curated Explore...');
    setTimeout(() => {
      navigate('/explore');
    }, 500);
  };

  return (
    <div className="relative mt-8 mb-6">
      {/* Toast Popup Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-4 py-2 rounded-2xl shadow-xl border border-slate-700 text-xs font-black flex items-center gap-2 whitespace-nowrap pointer-events-none"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="AI Trip Planner Coming Soon"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full bg-gradient-to-r from-[#F4F0FF] via-[#F8F5FF] to-[#FAF8FF] dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 rounded-[24px] p-5 sm:p-6 border border-[#E2D8FF] dark:border-white/10 shadow-md shadow-[#2563EB]/5 dark:shadow-none flex items-center gap-5 sm:gap-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition-all select-none"
      >
        {/* Left Section: Large AI Icon & Floating Sparkles */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-[#2563EB]/25">
            <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Sparkle Decorations */}
          <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-cyan-400 absolute -top-1.5 -left-1.5 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-cyan-500 absolute -bottom-1 -left-1 opacity-70" />
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-cyan-300 absolute -bottom-1 -right-2" />
        </div>

        {/* Center/Right Section */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-black tracking-wider uppercase">
            COMING SOON
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
            AI Trip Planner
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-300 leading-snug">
            We're crafting something amazing to plan your perfect trip. ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
};
