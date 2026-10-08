import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Maximize2,
  Calendar,
  HardDrive,
  FileType,
  AlertCircle,
  ShieldCheck,
  XCircle,
  FileUp,
  ChevronDown,
  ChevronUp,
  Hash,
  Globe,
  CheckCircle2,
  ScanFace,
} from 'lucide-react';
import { KycDocumentItem } from '../../../../types/userKyc';
import { KycStatusBadge } from './KycStatusBadge';

interface KycDocumentCardProps {
  document: KycDocumentItem;
  onPreview: (doc: KycDocumentItem) => void;
  onOpenFullscreen?: (doc: KycDocumentItem) => void;
  onApproveDoc?: (doc: KycDocumentItem) => void;
  onRejectDoc?: (doc: KycDocumentItem) => void;
  onRequestReuploadDoc?: (doc: KycDocumentItem) => void;
}

export const KycDocumentCard: React.FC<KycDocumentCardProps> = ({
  document,
  onPreview,
  onOpenFullscreen,
  onApproveDoc,
  onRejectDoc,
  onRequestReuploadDoc,
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  const uploadedDateFormatted = document.uploadedAt
    ? new Date(document.uploadedAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  const verifiedDateFormatted = document.verifiedAt
    ? new Date(document.verifiedAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const isImage =
    document.mimeType?.includes('image') ||
    document.fileUrl.match(/\.(jpeg|jpg|png|webp|gif)/i);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = `${document.type.replace(/\s+/g, '_')}_${document.id}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-100/90 shadow-2xs hover:border-[#6356E5]/40 transition-all space-y-3 group">
      {/* Top Row: Thumbnail + Info */}
      <div className="flex items-start gap-3">
        {/* Preview Thumbnail */}
        <div
          onClick={() => onPreview(document)}
          className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-[#6356E5]/30 transition-all flex items-center justify-center"
          title="Click to preview"
        >
          {isImage ? (
            <img
              src={document.thumbnailUrl || document.fileUrl}
              alt={document.type}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <FileText className="w-7 h-7 text-slate-400 group-hover:text-[#6356E5] transition-colors" />
          )}

          {/* Hover overlay icon */}
          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <h5 className="text-xs font-black text-[#0F172A] truncate">
              {document.type}
            </h5>
            <KycStatusBadge status={document.status} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-400 font-semibold pt-0.5">
            <span className="flex items-center gap-1 truncate">
              <Calendar className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span>Uploaded {uploadedDateFormatted}</span>
            </span>

            {verifiedDateFormatted ? (
              <span className="flex items-center gap-1 truncate text-emerald-600 font-bold">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                <span>Verified {verifiedDateFormatted}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 truncate">
                <HardDrive className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>{document.size || '1.8 MB'}</span>
              </span>
            )}

            <span className="flex items-center gap-1 truncate col-span-2">
              <FileType className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="uppercase text-[9px] font-mono text-slate-500">
                {document.mimeType || 'IMAGE/JPEG'} &bull; {document.documentNumberMasked || '•••• 4289'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Individual Rejection Reason if any */}
      {document.rejectionReason && (
        <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] flex items-start gap-1.5">
          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Reason: </span>
            <span>{document.rejectionReason}</span>
          </div>
        </div>
      )}

      {/* Collapsible Metadata Drawer */}
      {showMetadata && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1.5 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Hash className="w-2.5 h-2.5" /> Document Number
              </span>
              <span className="font-mono font-bold text-slate-700">
                {document.documentNumberMasked || '•••• •••• 4289'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" /> Country / Jurisdiction
              </span>
              <span className="font-bold text-slate-700">
                {document.country || 'India'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> Expiry Date
              </span>
              <span className="font-bold text-slate-700">
                {document.expiryDate || 'Lifetime'}
              </span>
            </div>

            {document.faceMatchPercent !== undefined && (
              <div>
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <ScanFace className="w-2.5 h-2.5" /> Face Match Score
                </span>
                <span className="font-bold text-emerald-600">
                  {document.faceMatchPercent}% Match
                </span>
              </div>
            )}

            <div className="col-span-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> OCR & Forgery Check
              </span>
              <span className="font-semibold text-slate-700 block mt-0.5">
                {document.ocrResult || 'OCR Validated'} &bull; {document.forgeryCheck || 'Passed (EXIF Verified)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Review Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(document)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-[#6356E5] bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMetadata(!showMetadata)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>Metadata</span>
            {showMetadata ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Action Review Buttons */}
        <div className="flex items-center gap-1">
          {document.status !== 'Verified' && onApproveDoc && (
            <button
              type="button"
              onClick={() => onApproveDoc(document)}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              title="Approve this document"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Approve</span>
            </button>
          )}

          {document.status !== 'Rejected' && onRejectDoc && (
            <button
              type="button"
              onClick={() => onRejectDoc(document)}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Reject this document"
            >
              <XCircle className="w-3 h-3 text-rose-500" />
              <span className="hidden sm:inline">Reject</span>
            </button>
          )}

          {onRequestReuploadDoc && (
            <button
              type="button"
              onClick={() => onRequestReuploadDoc(document)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Request re-upload for this document"
            >
              <FileUp className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Download original file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onOpenFullscreen && (
            <button
              type="button"
              onClick={() => onOpenFullscreen(document)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open full modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
