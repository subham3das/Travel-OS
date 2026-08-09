import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TravelersHeaderProps {
  tripId: string;
  totalCount: number;
  onExport?: () => void;
}

export const TravelersHeader: React.FC<TravelersHeaderProps> = ({
  tripId,
  totalCount,
  onExport,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
      <button
        type="button"
        onClick={() => navigate(`/agency/trips/${tripId}`)}
        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="text-center">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Travelers</h2>
        <p className="text-[11px] font-semibold text-slate-400">{totalCount} Travelers</p>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Export List</span>
      </button>
    </div>
  );
};

export default TravelersHeader;
