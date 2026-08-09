import React, { useState } from 'react';
import { FolderDown, Download, CheckCircle2 } from 'lucide-react';

export const DownloadAllCard: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadAll = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    }, 1800);
  };

  return (
    <div className="bg-gradient-to-r from-[#F4F0FF] via-[#F8F5FF] to-[#FAF8FF] rounded-3xl p-4 sm:p-5 border border-[#E2D8FF] shadow-xs flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center shrink-0">
          <FolderDown className="w-6 h-6" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm sm:text-base font-black text-[#0F172A] tracking-tight">
            All documents in one place
          </h3>
          <p className="text-xs font-semibold text-slate-500 leading-snug">
            Download all your trip documents as a single PDF file.
          </p>
        </div>
      </div>

      <button
        onClick={handleDownloadAll}
        disabled={downloading}
        className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 focus:outline-none"
      >
        {downloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Zipping...</span>
          </>
        ) : downloaded ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>ZIP Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </>
        )}
      </button>
    </div>
  );
};
