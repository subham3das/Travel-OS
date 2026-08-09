import React from 'react';
import { Save } from 'lucide-react';

interface StickyTeamActionBarProps {
  onSave?: () => void;
}

export const StickyTeamActionBar: React.FC<StickyTeamActionBarProps> = ({ onSave }) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:px-6 shadow-2xl select-none md:ml-64">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <button
          type="button"
          onClick={onSave}
          className="w-full sm:w-auto min-w-[240px] py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save Assignments</span>
        </button>
      </div>
    </div>
  );
};

export default StickyTeamActionBar;
