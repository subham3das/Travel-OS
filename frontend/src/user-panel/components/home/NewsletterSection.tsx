import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-amber-50/80 dark:from-[#0F172A] dark:via-[#131F38] dark:to-[#0B1528] p-6 sm:p-8 md:p-10 border border-rose-100/80 dark:border-blue-900/30 shadow-xs dark:shadow-xl overflow-hidden">
      {/* Dark Theme 10-15% Opacity Highlights */}
      <div className="hidden dark:block absolute -top-20 -right-20 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute -bottom-20 -left-20 w-72 h-72 bg-[#06B6D4]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Paper Plane Illustration Graphic */}
      <div className="absolute right-4 top-4 sm:right-10 sm:top-6 opacity-20 sm:opacity-30 pointer-events-none">
        <Send className="w-32 h-32 sm:w-44 sm:h-44 text-[#FF4D6D] dark:text-[#67E8F9] rotate-12 transition-colors duration-300" />
      </div>

      <div className="relative z-10 max-w-xl space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Get travel inspiration in your inbox
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
            Tips, hidden gems and exclusive offers delivered to you.
          </p>
        </div>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
            <span>Thank you! You've successfully subscribed to ApnaTrip newsletter.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-3 text-sm font-medium text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-[#FF4D6D] dark:focus:border-[#06B6D4] focus:ring-2 focus:ring-[#FF4D6D]/15 dark:focus:ring-[#06B6D4]/20 shadow-xs"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] dark:bg-gradient-to-r dark:from-[#2563EB] dark:to-[#06B6D4] dark:hover:from-[#1D4ED8] dark:hover:to-[#0891B2] text-white font-bold text-sm shadow-md shadow-[#FF4D6D]/20 dark:shadow-[#2563EB]/25 transition-all shrink-0 focus:outline-none cursor-pointer"
            >
              Subscribe
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
};
