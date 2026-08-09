import React, { useState } from 'react';
import { ArrowLeft, Filter, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinanceHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onOpenFilterModal?: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onOpenFilterModal,
}) => {
  const navigate = useNavigate();
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const presets = [
    '01 May - 31 May 2025',
    'Last 7 Days',
    'Last 30 Days',
    'Last 3 Months',
    'Last 6 Months',
    'Last 1 Year',
    'Custom Range',
  ];

  return (
    <div className="bg-white border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 space-y-3 sticky top-[3.5rem] z-20 select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/agency/analytics')}
          className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Back to Analytics"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-base sm:text-lg font-black text-[#0F172A]">Finance</h1>

        <button
          type="button"
          onClick={onOpenFilterModal}
          className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Filter"
        >
          <Filter className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Date Range Selector Pill */}
      <div className="flex justify-center relative">
        <button
          type="button"
          onClick={() => setShowPresetDropdown(!showPresetDropdown)}
          className="px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-black flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
          <span>{dateRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showPresetDropdown && (
          <div className="absolute top-10 z-30 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 w-56 animate-in fade-in slide-in-from-top-2 duration-150">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onDateRangeChange(preset);
                  setShowPresetDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  dateRange === preset
                    ? 'bg-purple-50 text-[#583BE8] font-black'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceHeader;
