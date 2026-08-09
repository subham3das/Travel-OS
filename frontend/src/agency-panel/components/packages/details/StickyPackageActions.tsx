import React from 'react';
import { Edit3, Copy, CalendarPlus, TrendingUp } from 'lucide-react';

interface StickyPackageActionsProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onCreateDeparture: () => void;
  onViewAnalytics: () => void;
}

export const StickyPackageActions: React.FC<StickyPackageActionsProps> = ({
  onEdit,
  onDuplicate,
  onCreateDeparture,
  onViewAnalytics,
}) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 sm:p-4 shadow-2xl select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 sm:flex-none px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer truncate"
          >
            <Edit3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Edit Package</span>
          </button>

          <button
            type="button"
            onClick={onCreateDeparture}
            className="flex-1 sm:flex-none px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer truncate"
          >
            <CalendarPlus className="w-4 h-4 shrink-0" />
            <span className="truncate">Create Departure</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDuplicate}
            className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={onViewAnalytics}
            className="px-3 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyPackageActions;
