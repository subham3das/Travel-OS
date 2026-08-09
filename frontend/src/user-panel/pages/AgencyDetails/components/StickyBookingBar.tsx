import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StickyBookingBarProps {
  startingPrice?: string;
  onViewPackages?: () => void;
}

export const StickyBookingBar: React.FC<StickyBookingBarProps> = ({
  startingPrice = '₹9,999',
  onViewPackages,
}) => {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Price */}
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Starting from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {startingPrice}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ person</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end max-w-sm">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsFav((p) => !p)}
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shrink-0 focus:outline-none cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 ${
                isFav ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-600'
              }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (onViewPackages) onViewPackages();
              else navigate('/search/results?tab=packages');
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#6356E5]/25 transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            <span>View Packages</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
