import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyItineraryButtonProps {
  onViewItinerary: () => void;
}

export const StickyItineraryButton: React.FC<StickyItineraryButtonProps> = ({ onViewItinerary }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-2xl h-[88px] px-5 py-4 flex items-center justify-center">
      <div className="w-full max-w-[1280px]">
        <button
          type="button"
          onClick={onViewItinerary}
          className="h-[56px] w-full rounded-[16px] bg-[#6356E5] hover:bg-[#5245d6] text-white font-black text-sm shadow-lg shadow-[#6356E5]/25 transition-all focus:outline-none flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span className="whitespace-nowrap font-black tracking-tight">View Full Itinerary</span>
          <ArrowRight className="w-4 h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};
