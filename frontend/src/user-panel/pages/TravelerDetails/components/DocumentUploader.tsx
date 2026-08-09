import React, { useState } from 'react';
import { Info, CheckCircle2, Upload, FileText, ChevronRight } from 'lucide-react';

export interface DocumentStatus {
  travelerName: string;
  travelerType: string;
  docType: string;
  isUploaded: boolean;
  fileUrl?: string;
}

interface DocumentUploaderProps {
  documents: DocumentStatus[];
  onUpload: (travelerName: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  onUpload,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Identity Documents
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Upload ID proof for all travelers
          </p>
        </div>

        <button
          onClick={() => alert('Accepted document types: Aadhaar, Passport, Driving License (Max 5MB PDF/JPG)')}
          className="flex items-center gap-1 text-xs font-extrabold text-[#6356E5] hover:underline cursor-pointer"
        >
          <Info className="w-4 h-4 text-[#6356E5]" />
          <span>View Guidelines</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                  {doc.travelerName} ({doc.travelerType})
                </h3>
                <p className="text-[11px] font-semibold text-slate-400">{doc.docType}</p>
              </div>
            </div>

            {doc.isUploaded ? (
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                <span>Uploaded</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ) : (
              <button
                onClick={() => onUpload(doc.travelerName)}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-[#6356E5] text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
