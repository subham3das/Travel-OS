import React from 'react';
import { Upload, FileSpreadsheet, FileText, FileCode } from 'lucide-react';

export const ExportReportsCard: React.FC = () => {
  const handleExport = (format: string) => {
    alert(`Financial Report exported in ${format} format!`);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
        <Upload className="w-4 h-4 text-[#583BE8]" />
        <span>Export Reports</span>
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {/* CSV Format */}
        <button
          type="button"
          onClick={() => handleExport('CSV')}
          className="p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/80 flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
            CSV
          </div>
          <span className="text-[11px] font-black text-slate-800 block">Download CSV</span>
        </button>

        {/* Excel Format */}
        <button
          type="button"
          onClick={() => handleExport('Excel')}
          className="p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/80 flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
            XLS
          </div>
          <span className="text-[11px] font-black text-slate-800 block">Download Excel</span>
        </button>

        {/* PDF Format */}
        <button
          type="button"
          onClick={() => handleExport('PDF')}
          className="p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/80 flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
            PDF
          </div>
          <span className="text-[11px] font-black text-slate-800 block">Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ExportReportsCard;
