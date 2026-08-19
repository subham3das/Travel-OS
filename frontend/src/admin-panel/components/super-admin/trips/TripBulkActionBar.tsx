import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Download,
  XCircle,
  Send,
  FileSpreadsheet,
  CheckSquare,
} from 'lucide-react';

interface TripBulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignGuide: () => void;
  onExportSelected: () => void;
  onCancelSelected: () => void;
  onSendNotification: () => void;
  onDownloadManifest: () => void;
}

export const TripBulkActionBar: React.FC<TripBulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onAssignGuide,
  onExportSelected,
  onCancelSelected,
  onSendNotification,
  onDownloadManifest,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 select-none"
    >
      {/* Left: Checked Count Badge */}
      <div className="flex items-center gap-2 pl-1.5">
        <div className="w-5 h-5 rounded-md bg-[#6356E5] text-white flex items-center justify-center shadow-xs">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-black text-[#0F172A]">
          {selectedCount} Selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:underline cursor-pointer ml-1"
        >
          Clear
        </button>
      </div>

      {/* Right: Operational Bulk Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Assign Guide */}
        <button
          onClick={onAssignGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Assign Guide</span>
        </button>

        {/* Export Selected */}
        <button
          onClick={onExportSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Selected</span>
        </button>

        {/* Cancel Trips */}
        <button
          onClick={onCancelSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Cancel Trips</span>
        </button>

        {/* Send Notification */}
        <button
          onClick={onSendNotification}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-[#6356E5] text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Send className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>Send Notification</span>
        </button>

        {/* Download Manifest */}
        <button
          onClick={onDownloadManifest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Download Manifest</span>
        </button>
      </div>
    </motion.div>
  );
};
