import React from 'react';
import { Download, FileText, Clock, Laptop } from 'lucide-react';

interface ProfileQuickActionsProps {
  onDownloadProfile: () => void;
  onExportActivity: () => void;
  onViewAuditLogs: () => void;
  onManageSessions: () => void;
}

export const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({
  onDownloadProfile,
  onExportActivity,
  onViewAuditLogs,
  onManageSessions,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h3 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-100/80">
        Quick Actions
      </h3>

      <div className="space-y-2">
        <button
          onClick={onDownloadProfile}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] text-xs font-bold transition-colors cursor-pointer border border-slate-100 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-400" />
            <span>Download Profile PDF</span>
          </div>
          <span className="text-[10px] text-slate-400">PDF</span>
        </button>

        <button
          onClick={onExportActivity}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] text-xs font-bold transition-colors cursor-pointer border border-slate-100 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Export Activity Log</span>
          </div>
          <span className="text-[10px] text-slate-400">CSV</span>
        </button>

        <button
          onClick={onViewAuditLogs}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] text-xs font-bold transition-colors cursor-pointer border border-slate-100 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>View Full Audit Logs</span>
          </div>
          <span className="text-[10px] text-[#6356E5] font-black">SOC →</span>
        </button>

        <button
          onClick={onManageSessions}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] text-xs font-bold transition-colors cursor-pointer border border-slate-100 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-slate-400" />
            <span>Manage All Sessions</span>
          </div>
          <span className="text-[10px] text-slate-400">3 Active</span>
        </button>
      </div>
    </div>
  );
};
