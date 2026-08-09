import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StickyCTAProps {
  startingPrice: string;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({ startingPrice }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-2xl h-[88px] px-5 py-4 flex items-center justify-center">
      <div className="w-full max-w-[1280px] flex items-center justify-between gap-[24px]">
        {/* Left Starting Price */}
        <div className="space-y-0.5 shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Starting From</p>
          <p className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none">
            {startingPrice} <span className="text-xs font-semibold text-slate-400">/ person</span>
          </p>
        </div>

        {/* Right CTA Button */}
        <button
          type="button"
          onClick={() => navigate('/search/results')}
          className="h-[56px] px-7 rounded-[16px] bg-[#6356E5] hover:bg-[#5245d6] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#6356E5]/25 transition-all focus:outline-none flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
        >
          <span className="whitespace-nowrap font-black tracking-tight">Explore Packages</span>
          <ArrowRight className="w-4 h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};
