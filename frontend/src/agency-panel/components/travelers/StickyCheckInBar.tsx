import React from 'react';
import { Users } from 'lucide-react';

interface StickyCheckInBarProps {
  onCheckInAll?: () => void;
}

export const StickyCheckInBar: React.FC<StickyCheckInBarProps> = ({ onCheckInAll }) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:px-6 shadow-2xl select-none md:ml-64">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onCheckInAll}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
        >
          <Users className="w-5 h-5 stroke-[2.2]" />
          <span>Check-in All Travelers</span>
        </button>
      </div>
    </div>
  );
};

export default StickyCheckInBar;
