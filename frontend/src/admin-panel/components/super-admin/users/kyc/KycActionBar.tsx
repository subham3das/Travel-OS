import React from 'react';
import {
  ShieldCheck,
  XCircle,
  RotateCcw,
  RefreshCw,
  FileUp,
  History,
  PlayCircle,
  Download,
} from 'lucide-react';
import { KycStatusType } from '../../../../types/userKyc';

interface KycActionBarProps {
  status: KycStatusType | string;
  onApprove: () => void;
  onReject: () => void;
  onRequestReupload: () => void;
  onRevoke: () => void;
  onRenew: () => void;
  onUnsuspend: () => void;
  onViewAuditHistory: () => void;
  onDownloadReport?: () => void;
  disabled?: boolean;
}

export const KycActionBar: React.FC<KycActionBarProps> = ({
  status,
  onApprove,
  onReject,
  onRequestReupload,
  onRevoke,
  onRenew,
  onUnsuspend,
  onViewAuditHistory,
  onDownloadReport,
  disabled = false,
}) => {
  const norm = (status || 'None').toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-100/90 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Compliance Actions
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          State: <span className="text-[#6356E5] font-extrabold">{status}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* PENDING STATE ACTIONS */}
        {(norm === 'PENDING' || norm === 'UNDER REVIEW' || norm === 'NONE') && (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={onApprove}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve KYC</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onReject}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject KYC</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onRequestReupload}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Request user to re-upload clear documents"
            >
              <FileUp className="w-3.5 h-3.5 text-slate-500" />
              <span>Re-upload</span>
            </button>
          </>
        )}

        {/* VERIFIED STATE ACTIONS */}
        {norm === 'VERIFIED' && (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={onRevoke}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revoke Verification</span>
            </button>

            {onDownloadReport && (
              <button
                type="button"
                disabled={disabled}
                onClick={onDownloadReport}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                title="Download full verification audit report"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Verification Report</span>
              </button>
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={onViewAuditHistory}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-[#6356E5] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Audit History</span>
            </button>
          </>
        )}

        {/* REJECTED STATE ACTIONS */}
        {norm === 'REJECTED' && (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={onApprove}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onRequestReupload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Request New Upload</span>
            </button>
          </>
        )}

        {/* EXPIRED STATE ACTIONS */}
        {norm === 'EXPIRED' && (
          <button
            type="button"
            disabled={disabled}
            onClick={onRenew}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white bg-[#6356E5] hover:bg-[#5244e0] shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Renew Verification</span>
          </button>
        )}

        {/* SUSPENDED STATE ACTIONS */}
        {norm === 'SUSPENDED' && (
          <button
            type="button"
            disabled={disabled}
            onClick={onUnsuspend}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Unsuspend KYC</span>
          </button>
        )}
      </div>
    </div>
  );
};
