import React from 'react';
import { Calendar, Download, ChevronDown, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { AnalyticsSubTab } from '../../hooks/useAnalytics';

interface AnalyticsDateBarProps {
  dateRange: string;
  onDateRangeChange: (val: any) => void;
  activeTab: AnalyticsSubTab;
  onTabChange: (tab: AnalyticsSubTab) => void;
  isExportOpen: boolean;
  onToggleExport: () => void;
  onExport: (format: 'PDF' | 'Excel' | 'CSV') => void;
}

export const AnalyticsDateBar: React.FC<AnalyticsDateBarProps> = ({
  dateRange,
  onDateRangeChange,
  activeTab,
  onTabChange,
  isExportOpen,
  onToggleExport,
  onExport,
}) => {
  const tabs: AnalyticsSubTab[] = [
    'Overview',
    'Revenue',
    'Bookings',
    'Packages',
    'Travelers',
    'Destinations',
    'Trips',
    'Finance',
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Top Date Range Selector & Export Dropdown */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Date Selector Pill */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-extrabold text-[#0F172A] shadow-2xs">
            <Calendar className="w-4 h-4 text-[#583BE8]" />
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="appearance-none bg-transparent pr-5 focus:outline-none cursor-pointer font-extrabold text-xs"
            >
              <option value="01 Aug 2025 - 08 Aug 2025">01 Aug 2025 - 08 Aug 2025</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
              <option value="Custom Range">Custom Range</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Export Button Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={onToggleExport}
            className="px-4 py-2 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => onExport('PDF')}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>PDF Report</span>
              </button>
              <button
                type="button"
                onClick={() => onExport('Excel')}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2"
              >
                <Table className="w-4 h-4 text-emerald-600" />
                <span>Excel Spreadsheet</span>
              </button>
              <button
                type="button"
                onClick={() => onExport('CSV')}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>CSV Data File</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Sub-nav Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-[#583BE8] text-white border-[#583BE8] shadow-xs scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-purple-200 shadow-2xs'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsDateBar;
