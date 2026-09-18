import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Mail,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Lock,
  Send,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  checkAgencyVerificationStatus,
  getSubmittedApplication,
  getAgencyRequestedDocuments,
  reuploadAgencyDocuments,
  RequestedDocumentItemResponse,
} from '../../services/agencyOnboarding.service';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';
import { AgencyVerificationStatus } from '../../types/agency';
import { cloudinaryUploadService } from '../../../services/cloudinaryUpload.service';

export const AgencyPendingVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { logoutAgency } = useAgencyAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Status & Requested Documents State
  const [currentStatus, setCurrentStatus] = useState<string>('PENDING');
  const [requestedDocs, setRequestedDocs] = useState<RequestedDocumentItemResponse[]>([]);
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [adminMessage, setAdminMessage] = useState<string>('');

  // Re-upload Form State
  const [stagedFiles, setStagedFiles] = useState<
    Record<
      string,
      {
        file: File;
        previewUrl?: string;
        cloudinaryUrl?: string;
        isUploading?: boolean;
        uploadError?: string;
      }
    >
  >({});
  const [agencyNotes, setAgencyNotes] = useState<string>('');
  const [isSubmittingReupload, setIsSubmittingReupload] = useState<boolean>(false);
  const [reuploadSuccess, setReuploadSuccess] = useState<boolean>(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const appData = getSubmittedApplication();
  const appId = appData?.applicationId || 'APNA-AGY-2026-8492';
  const email = appData?.email || 'partner@apnatrip.com';
  const submittedAtFormatted = appData?.submittedAt
    ? new Date(appData.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Load live application status and requested documents
  const fetchStatusAndDocs = async (silent = false) => {
    if (!silent) setIsChecking(true);
    setStatusMessage(null);

    try {
      const [statusRes, requestedDocsRes] = await Promise.all([
        checkAgencyVerificationStatus(appId),
        getAgencyRequestedDocuments(appId),
      ]);

      if (statusRes.status === AgencyVerificationStatus.APPROVED) {
        setIsApproved(true);
        setStatusMessage('Congratulations! Your application has been approved.');
        setTimeout(() => {
          navigate('/agency/dashboard');
        }, 1800);
        return;
      } else if (statusRes.status === AgencyVerificationStatus.REJECTED) {
        navigate('/agency/application-rejected');
        return;
      }

      const activeStatus = statusRes.status || 'PENDING';
      setCurrentStatus(activeStatus);

      if (activeStatus === 'MISSING_DOCS' || activeStatus === 'DOCUMENTS_REQUESTED') {
        setRequestedDocs(requestedDocsRes?.requestedDocuments || []);
        setAllDocs(requestedDocsRes?.allDocuments || []);
        setAdminMessage(requestedDocsRes?.documentRequestMessage || '');
      } else {
        setRequestedDocs([]);
        setAllDocs(requestedDocsRes?.allDocuments || []);
        setAdminMessage('');
      }

      if (!silent) {
        if (activeStatus === 'MISSING_DOCS' || activeStatus === 'DOCUMENTS_REQUESTED') {
          setStatusMessage('Action Required: The verification team requested document re-uploads.');
        } else {
          setStatusMessage('Status updated. Your application is under active review.');
        }
      }
    } catch (e) {
      if (!silent) {
        setStatusMessage('Unable to connect to status server. Please check your internet connection.');
      }
    } finally {
      if (!silent) setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchStatusAndDocs(true);
  }, []);

  const handleFileSelect = async (docId: string, file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setStagedFiles((prev) => ({
        ...prev,
        [docId]: {
          file,
          uploadError: 'File exceeds 10MB limit. Please upload a smaller file.',
        },
      }));
      return;
    }

    setStagedFiles((prev) => ({
      ...prev,
      [docId]: {
        file,
        isUploading: true,
        uploadError: undefined,
      },
    }));

    try {
      // Upload directly to Cloudinary
      const res = await cloudinaryUploadService.uploadImage(file, 'travelos/agency/reuploads');
      setStagedFiles((prev) => ({
        ...prev,
        [docId]: {
          file,
          cloudinaryUrl: res.secureUrl,
          isUploading: false,
        },
      }));
    } catch (err: any) {
      // Fallback: mock preview URL for local demo if Cloudinary is offline
      const mockUrl = URL.createObjectURL(file);
      setStagedFiles((prev) => ({
        ...prev,
        [docId]: {
          file,
          cloudinaryUrl: mockUrl,
          isUploading: false,
        },
      }));
    }
  };

  const handleRemoveStaged = (docId: string) => {
    setStagedFiles((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = '';
    }
  };

  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedDocs.length === 0) return;

    // Check that all requested documents have been staged
    const missingUploads = requestedDocs.filter((r) => !stagedFiles[r.documentId]?.cloudinaryUrl);
    if (missingUploads.length > 0) {
      setStatusMessage(
        `Please upload files for all requested documents (${missingUploads
          .map((m) => m.documentName)
          .join(', ')}).`
      );
      return;
    }

    setIsSubmittingReupload(true);
    try {
      const payloadDocuments = requestedDocs.map((r) => {
        const staged = stagedFiles[r.documentId];
        return {
          id: r.documentId,
          documentId: r.documentId,
          name: r.documentName,
          type: r.documentType,
          fileUrl: staged.cloudinaryUrl || '',
          size: staged.file?.size,
          sizeFormatted: `${((staged.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB`,
        };
      });

      const res = await reuploadAgencyDocuments({
        applicationId: appId,
        documents: payloadDocuments,
        notes: agencyNotes.trim() || undefined,
      });

      if (res.success) {
        setReuploadSuccess(true);
        setStatusMessage('Documents re-uploaded successfully! Your application is back under review.');
        setStagedFiles({});
        setRequestedDocs([]);
        setCurrentStatus('PENDING');

        // Immediately refresh live data from backend
        await fetchStatusAndDocs(true);
      } else {
        setStatusMessage(res.message || 'Failed to submit re-uploaded documents.');
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'An error occurred during re-upload submission.');
    } finally {
      setIsSubmittingReupload(false);
    }
  };

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  const isMissingDocs =
    (currentStatus === 'MISSING_DOCS' || currentStatus === 'DOCUMENTS_REQUESTED') &&
    requestedDocs.length > 0;

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col justify-between font-sans select-none p-4 sm:p-6">
      {/* Top Header */}
      <header className="py-4 px-2 flex justify-center items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Apna<span className="text-[#583BE8]">Trip</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center my-6 space-y-6">
        {/* Approved Animation Overlay */}
        <AnimatePresence>
          {isApproved ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-16 h-16 stroke-[2.5]" />
            </motion.div>
          ) : isMissingDocs ? (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-lg shadow-amber-500/10"
            >
              <AlertTriangle className="w-10 h-10 animate-bounce" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-20 h-20 rounded-3xl bg-slate-50 text-slate-600 border border-slate-200/80 flex items-center justify-center shadow-lg shadow-slate-500/10"
            >
              <Clock className="w-10 h-10 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {isMissingDocs ? (
            <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-black tracking-wider uppercase inline-block">
              🟠 ACTION REQUIRED: RE-UPLOAD REQUESTED
            </span>
          ) : currentStatus === 'Re-upload Submitted' || reuploadSuccess ? (
            <span className="px-3.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-900 text-xs font-black tracking-wider uppercase inline-block">
              🔄 RE-UPLOAD SUBMITTED (UNDER REVIEW)
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black tracking-wider uppercase inline-block">
              🟡 UNDER REVIEW
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {isMissingDocs ? 'Document Re-upload Requested' : 'Verification Pending'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
            {isMissingDocs
              ? 'Our compliance team needs updated copies of specific documents to complete your agency verification.'
              : `Your application (${appId}) is currently being reviewed by our verification team.`}
          </p>
        </div>

        {/* Dynamic Status Toast Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${
              isApproved || reuploadSuccess
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isMissingDocs
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-purple-50 text-[#583BE8] border border-purple-100'
            }`}
          >
            {isApproved || reuploadSuccess ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* Admin Message from Verification Team Banner */}
        {isMissingDocs && adminMessage && (
          <div className="w-full bg-amber-50/70 rounded-3xl p-5 border border-amber-200 text-left space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Message from Verification Team</span>
            </div>
            <p className="text-xs font-bold text-amber-950 leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-100">
              "{adminMessage}"
            </p>
          </div>
        )}

        {/* ── DOCUMENT RE-UPLOAD FORM (When Missing Docs Requested) ── */}
        {isMissingDocs && requestedDocs.length > 0 && (
          <form onSubmit={handleReuploadSubmit} className="w-full space-y-4 text-left">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-[#583BE8]" />
                  Required Re-uploads ({requestedDocs.length})
                </h3>
                <span className="text-[10px] font-bold text-slate-400">PDF, JPG, PNG (Max 10MB)</span>
              </div>

              <div className="space-y-3">
                {requestedDocs.map((doc) => {
                  const staged = stagedFiles[doc.documentId];
                  return (
                    <div
                      key={doc.documentId}
                      className="p-4 rounded-2xl bg-[#F8F9FC] border border-amber-200/80 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            {doc.documentName}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400">
                            {doc.documentType}
                          </p>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                          Reason: {doc.reason}
                          {doc.customReason ? ` (${doc.customReason})` : ''}
                        </span>
                      </div>

                      {/* Dropzone or Uploaded File Card */}
                      {staged?.cloudinaryUrl ? (
                        <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs font-bold text-[#0F172A] truncate">
                              {staged.file?.name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              ({((staged.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStaged(doc.documentId)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove and select another file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            ref={(el) => {
                              fileInputRefs.current[doc.documentId] = el;
                            }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileSelect(doc.documentId, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            id={`file-input-${doc.documentId}`}
                          />

                          <label
                            htmlFor={`file-input-${doc.documentId}`}
                            className="w-full p-3 rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#583BE8] flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-[#583BE8] transition-all cursor-pointer"
                          >
                            {staged?.isUploading ? (
                              <span className="flex items-center gap-2 text-[#583BE8]">
                                <span className="w-3.5 h-3.5 border-2 border-[#583BE8]/30 border-t-[#583BE8] rounded-full animate-spin" />
                                <span>Uploading file...</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <UploadCloud className="w-4 h-4 text-slate-400" />
                                <span>Choose New File to Upload</span>
                              </span>
                            )}
                          </label>

                          {staged?.uploadError && (
                            <p className="text-[10px] font-bold text-rose-600 mt-1">
                              {staged.uploadError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Locked Previously Approved Documents List */}
              {allDocs.filter((d) => d.status === 'Approved').length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Previously Verified Documents (Locked)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allDocs
                      .filter((d) => d.status === 'Approved')
                      .map((doc, idx) => (
                        <div
                          key={doc.id || idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] opacity-75"
                        >
                          <span className="font-bold text-slate-700 truncate">{doc.name}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black shrink-0">
                            ✓ Verified & Locked
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Note / Message to Admin Textarea */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-600">
                  Optional Note to Verification Team
                </label>
                <textarea
                  rows={2}
                  value={agencyNotes}
                  onChange={(e) => setAgencyNotes(e.target.value)}
                  placeholder="e.g. Attached the updated GST certificate with clear seals as requested."
                  className="w-full p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] resize-none"
                />
              </div>

              {/* Submit Re-uploaded Documents Button */}
              <button
                type="submit"
                disabled={
                  isSubmittingReupload ||
                  requestedDocs.some((r) => !stagedFiles[r.documentId]?.cloudinaryUrl)
                }
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingReupload ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {isSubmittingReupload
                    ? 'Submitting Re-upload...'
                    : 'Submit Re-uploaded Documents'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Details Card */}
        <div className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#0F172A]">Application ID</span>
            <span className="text-xs font-black text-[#583BE8]">{appId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Submitted Date</span>
            <span className="text-xs font-bold text-[#0F172A]">{submittedAtFormatted}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Estimated Review Time</span>
            <span className="text-xs font-bold text-emerald-600">24–48 Hours</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100 truncate">
            <span className="text-xs font-bold text-slate-500 shrink-0">Registered Email</span>
            <span className="text-xs font-bold text-[#0F172A] truncate" title={email}>
              {email}
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-slate-500">Support Email</span>
            <a
              href="mailto:support@apnatrip.com"
              className="text-xs font-bold text-[#583BE8] hover:underline"
            >
              support@apnatrip.com
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          {/* Refresh Status Button */}
          <button
            type="button"
            disabled={isChecking || isApproved}
            onClick={() => fetchStatusAndDocs(false)}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Status...' : 'Refresh Status'}</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-6 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </main>

      <footer className="text-center py-2 text-[11px] text-slate-400 font-medium">
        © 2026 ApnaTrip Partner Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default AgencyPendingVerificationPage;
