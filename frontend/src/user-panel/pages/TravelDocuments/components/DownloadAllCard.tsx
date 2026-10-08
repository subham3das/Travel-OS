import React from 'react';
import { FolderDown, Download } from 'lucide-react';
import { TravelDocument } from '../../../data/documents';
import { useToast } from '../../../context/ToastContext';

interface DownloadAllCardProps {
  documents?: TravelDocument[];
  onDownloadAll?: () => void;
}

export const DownloadAllCard: React.FC<DownloadAllCardProps> = ({
  documents = [],
  onDownloadAll,
}) => {
  const { showToast } = useToast();

  if (!documents || documents.length === 0) {
    return null;
  }

  const handleDownloadAll = () => {
    if (onDownloadAll) {
      onDownloadAll();
      return;
    }
    const primary = documents.find((d) => d.downloadUrl && d.downloadUrl !== '#');
    if (primary?.downloadUrl) {
      window.open(primary.downloadUrl, '_blank');
    } else {
      showToast('No downloadable documents available at this time.', 'info');
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#F4F0FF] via-[#F8F5FF] to-[#FAF8FF] dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 rounded-3xl p-4 sm:p-5 border border-[#E2D8FF] dark:border-white/10 shadow-xs dark:shadow-none flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
          <FolderDown className="w-6 h-6" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white tracking-tight">
            All documents in one place
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 leading-snug">
            Download all your trip documents as a single PDF file.
          </p>
        </div>
      </div>

      <button
        onClick={handleDownloadAll}
        className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-md shadow-[#2563EB]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 focus:outline-none"
      >
        <Download className="w-4 h-4" />
        <span>Download All</span>
      </button>
    </div>
  );
};
