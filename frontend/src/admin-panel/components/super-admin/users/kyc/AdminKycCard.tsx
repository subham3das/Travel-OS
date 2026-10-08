import React from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Hash,
  FileText,
} from 'lucide-react';
import { AdminKycData } from '../../../../types/userKyc';
import { KycStatusBadge } from './KycStatusBadge';

interface AdminKycCardProps {
  kyc: AdminKycData;
  isLoading?: boolean;
}

export const AdminKycCard: React.FC<AdminKycCardProps> = ({ kyc, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-1">
              <div className="h-2.5 w-16 bg-slate-100 rounded" />
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const submittedFormatted = kyc.submittedAt
    ? new Date(kyc.submittedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const updatedFormatted = kyc.lastUpdated
    ? new Date(kyc.lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const verifiedFormatted = kyc.verifiedAt
    ? new Date(kyc.verifiedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not verified yet';

  const reviewerName = kyc.reviewedBy?.name
    ? `${kyc.reviewedBy.name}${kyc.reviewedBy.role ? ` (${kyc.reviewedBy.role})` : ''}`
    : 'Pending Reviewer';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-[#6356E5] shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
              KYC Verification
            </h4>
            <p className="text-[10px] font-semibold text-slate-400">
              Government Identity & Compliance Status
            </p>
          </div>
        </div>
        <KycStatusBadge status={kyc.status} size="sm" />
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Hash className="w-2.5 h-2.5" /> Verification ID
          </span>
          <span className="font-mono font-extrabold text-[#6356E5] text-[11px] break-all">
            {kyc.verificationId || 'KYC-PENDING'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" /> Submitted Date
          </span>
          <span className="font-extrabold text-slate-700">
            {submittedFormatted}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Last Updated
          </span>
          <span className="font-bold text-slate-700 text-[11px]">
            {updatedFormatted}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" /> Verified Date
          </span>
          <span
            className={`font-extrabold ${
              kyc.verifiedAt ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {verifiedFormatted}
          </span>
        </div>

        {kyc.riskScore !== undefined && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Risk Assessment
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-extrabold text-slate-700 text-xs">
                {kyc.riskScore}/100
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  (kyc.riskLevel || 'Low') === 'Low'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : (kyc.riskLevel || 'Low') === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {kyc.riskLevel || 'Low'} Risk
              </span>
            </div>
          </div>
        )}

        {kyc.faceMatchPercent !== undefined && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <UserCheck className="w-2.5 h-2.5" /> Biometric Face Match
            </span>
            <span className="font-extrabold text-emerald-600 text-xs">
              {kyc.faceMatchPercent}% Match
            </span>
          </div>
        )}

        {kyc.documentMatchPercent !== undefined && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" /> Document Match
            </span>
            <span className="font-extrabold text-slate-700 text-xs">
              {kyc.documentMatchPercent}% Accuracy
            </span>
          </div>
        )}

        {kyc.fraudDetection && (
          <div className="col-span-2">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Fraud & Forgery Analysis
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-lg border border-emerald-100 inline-block mt-0.5">
              {kyc.fraudDetection}
            </span>
          </div>
        )}

        {kyc.governmentValidation && (
          <div className="col-span-2">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Government Gateway
            </span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 inline-block mt-0.5">
              {kyc.governmentValidation}
            </span>
          </div>
        )}

        {kyc.verificationSource && (
          <div className="col-span-2">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Hash className="w-2.5 h-2.5" /> Verification Source
            </span>
            <span className="font-semibold text-slate-600 text-[11px]">
              {kyc.verificationSource}
            </span>
          </div>
        )}

        <div className="col-span-2 pt-1 border-t border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <UserCheck className="w-2.5 h-2.5" /> Reviewed By
          </span>
          <span className="font-bold text-slate-700">
            {reviewerName}
          </span>
        </div>
      </div>

      {/* Rejection Reason Alert if any */}
      {kyc.rejectionReason && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-black text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Rejection Reason</span>
          </div>
          <p className="text-[11px] font-semibold pl-5 leading-relaxed">
            {kyc.rejectionReason}
          </p>
        </div>
      )}

      {/* Internal Admin Note if any */}
      {kyc.internalNote && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
            <FileText className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Internal Compliance Note</span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed">
            {kyc.internalNote}
          </p>
        </div>
      )}
    </div>
  );
};
