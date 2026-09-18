import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Eye,
  Clock,
  ShieldCheck,
  Save,
  Check,
  Building2,
  Landmark,
  CreditCard,
} from 'lucide-react';
import { AgencyRequestItem } from '../../../types/agencyRequest';
import { VerificationChecklist } from './VerificationChecklist';
import { ApplicationTimeline } from './ApplicationTimeline';
import { adminAgencyRequestService } from '../../../services/adminAgencyRequest.service';
import { useToast } from '../../../../user-panel/context/ToastContext';

interface AgencyRequestDrawerProps {
  request: AgencyRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (request: AgencyRequestItem) => void;
  onReject: (request: AgencyRequestItem) => void;
  onRequestDocs: (request: AgencyRequestItem) => void;
  onUpdateRequest?: (updatedRequest: AgencyRequestItem) => void;
}

export const AgencyRequestDrawer: React.FC<AgencyRequestDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestDocs,
  onUpdateRequest,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Documents' | 'Verification' | 'Activity'>(
    'Overview'
  );
  const [currentRequest, setCurrentRequest] = useState<AgencyRequestItem | null>(request);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedSuccess, setNoteSavedSuccess] = useState(false);

  // Approve Documents Modal State
  const [isApproveDocsModalOpen, setIsApproveDocsModalOpen] = useState(false);
  const [isApprovingDocs, setIsApprovingDocs] = useState(false);

  // Approve Bank Details State
  const [isApprovingBank, setIsApprovingBank] = useState(false);

  useEffect(() => {
    if (request) {
      setCurrentRequest(request);
      setReviewNotes(request.reviewNotes || '');
      setNoteSavedSuccess(false);
    }
  }, [request]);

  if (!isOpen || !currentRequest) return null;

  const activeData = currentRequest;

  const handleSaveNote = async () => {
    if (!activeData || !reviewNotes.trim() || isSavingNote) return;
    setIsSavingNote(true);
    try {
      await adminAgencyRequestService.saveReviewNotes(activeData.id, reviewNotes.trim());
      setNoteSavedSuccess(true);
      setTimeout(() => setNoteSavedSuccess(false), 2500);
      showToast('Review note saved successfully', 'success');
    } catch (err: any) {
      console.error('Failed to save review note:', err);
      showToast(err.message || 'Failed to save review note', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleConfirmApproveDocs = async () => {
    if (!activeData || isApprovingDocs) return;
    setIsApprovingDocs(true);
    try {
      const res = await adminAgencyRequestService.approveAgencyDocuments(activeData.id);
      if (res.success && res.agency) {
        setCurrentRequest(res.agency);
        if (onUpdateRequest) {
          onUpdateRequest(res.agency);
        }
        setIsApproveDocsModalOpen(false);
        showToast(res.message || 'Documents approved successfully', 'success');
      } else {
        showToast(res.message || 'Failed to approve documents', 'error');
      }
    } catch (err: any) {
      console.error('Approve documents error:', err);
      showToast(err.message || 'Failed to approve documents', 'error');
    } finally {
      setIsApprovingDocs(false);
    }
  };

  const handleApproveBankDetails = async () => {
    if (!activeData || isApprovingBank) return;
    setIsApprovingBank(true);
    try {
      const res = await adminAgencyRequestService.approveAgencyBankDetails(activeData.id);
      if (res.success && res.agency) {
        setCurrentRequest(res.agency);
        if (onUpdateRequest) {
          onUpdateRequest(res.agency);
        }
        showToast(res.message || 'Bank settlement details approved successfully', 'success');
      } else {
        showToast(res.message || 'Failed to approve bank details', 'error');
      }
    } catch (err: any) {
      console.error('Approve bank details error:', err);
      showToast(err.message || 'Failed to approve bank details', 'error');
    } finally {
      setIsApprovingBank(false);
    }
  };

  const handlePreviewDoc = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadDoc = (url?: string, name?: string) => {
    if (url && url !== '#') {
      const link = document.createElement('a');
      link.href = url;
      link.download = name || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const documentsList = activeData.documents || [];
  const activitiesList = activeData.activities || [];
  const hasPendingDocs = documentsList.some(
    (doc) => doc.status !== 'Approved'
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Sliding Panel (440px) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[440px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center font-black text-sm">
                  {activeData.agencyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#0F172A] truncate max-w-[200px]">
                      {activeData.agencyName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        activeData.verificationStatus === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : activeData.reviewStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : activeData.verificationStatus === 'Missing Docs'
                          ? 'bg-purple-50 text-[#6356E5] border-purple-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {activeData.verificationStatus || activeData.reviewStatus}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    {activeData.applicationId}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Submitted on {activeData.submittedDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0">
              {(['Overview', 'Documents', 'Verification', 'Activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body Scroll Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
              {activeTab === 'Overview' && (
                <>
                  {/* Agency & Owner Info Grid (2 Columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Agency Info */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Agency Information
                      </h4>
                      <div className="space-y-1.5 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Agency Name</span>
                          <span className="text-[#0F172A] font-extrabold text-[11px] leading-tight block truncate">
                            {activeData.agencyName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Business Type</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {activeData.businessType}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">GST Number</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {activeData.gstNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Website</span>
                          <span className="text-[#6356E5] font-bold text-[11px] leading-tight block truncate">
                            {activeData.website}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Owner Information
                      </h4>
                      <div className="space-y-1.5 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Owner Name</span>
                          <span className="text-[#0F172A] font-extrabold text-[11px] leading-tight block truncate">
                            {activeData.ownerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Email</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {activeData.ownerEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Phone</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {activeData.ownerPhone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">PAN Number</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {activeData.panNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── BANK SETTLEMENT ACCOUNT & IFSC VERIFICATION CARD ── */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#6356E5] flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                          Bank Settlement Account & IFSC Verification
                        </h4>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          activeData.bankDetails?.verified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {activeData.bankDetails?.verified ? 'Verified' : 'Under Review'}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Account Holder</span>
                          <span className="text-[#0F172A] font-extrabold text-[11px] leading-tight block truncate">
                            {activeData.bankDetails?.accountHolderName || activeData.ownerName || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Bank Name</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {activeData.bankDetails?.bankName || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Account Number</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block font-mono">
                            {activeData.bankDetails?.accountNumber || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">IFSC Code</span>
                          <span className="text-[#6356E5] font-extrabold text-[11px] leading-tight block font-mono">
                            {activeData.bankDetails?.ifscCode || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Account / Payout Type</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {activeData.bankDetails?.accountType || activeData.bankDetails?.payoutMethod || 'Current Account'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Branch / UPI ID</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {activeData.bankDetails?.branch || activeData.bankDetails?.upiId || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bank Review and Approval Button */}
                    <div className="pt-1">
                      {!activeData.bankDetails?.verified ? (
                        <button
                          type="button"
                          onClick={handleApproveBankDetails}
                          disabled={isApprovingBank}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {isApprovingBank ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                              <span>Approving Bank Details...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve Bank Details</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bank Details Approved & Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checklist & Documents Summary Grid (2 Columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    <VerificationChecklist checklist={activeData.verificationChecklist} />

                    {/* Documents Summary Card */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Documents Summary
                      </h4>
                      <div className="space-y-2 text-xs font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Documents</span>
                          <span className="font-extrabold text-[#0F172A]">{activeData.documentsTotalCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Uploaded</span>
                          <span className="font-extrabold text-emerald-600">{activeData.documentsUploadedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Missing</span>
                          <span className="font-extrabold text-rose-600">
                            {activeData.documentsTotalCount - activeData.documentsUploadedCount}
                          </span>
                        </div>

                        {/* Completion Progress Bar */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Completion</span>
                            <span>{Math.round((activeData.documentsUploadedCount / Math.max(1, activeData.documentsTotalCount)) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#6356E5] rounded-full"
                              style={{
                                width: `${(activeData.documentsUploadedCount / Math.max(1, activeData.documentsTotalCount)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes Textarea */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Review Notes
                      </h4>
                      <button
                        onClick={handleSaveNote}
                        disabled={isSavingNote || !reviewNotes.trim()}
                        className="text-[10px] font-extrabold text-[#6356E5] hover:text-[#5244e0] flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                      >
                        {noteSavedSuccess ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Saved</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            <span>{isSavingNote ? 'Saving...' : 'Save Note'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add internal review notes for compliance team..."
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] resize-none"
                    />
                  </div>

                  {/* Decision Buttons (Approve, Reject, Request Documents) */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider mb-1">
                      Decision
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onApprove(activeData)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => onReject(activeData)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => onRequestDocs(activeData)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Request Docs</span>
                      </button>
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <ApplicationTimeline timeline={activeData.timeline} />
                </>
              )}

              {activeTab === 'Documents' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Uploaded Documents ({documentsList.length})
                  </h4>
                  {documentsList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl">
                      No documents uploaded yet by this agency.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {documentsList.map((doc, idx) => (
                        <div
                          key={doc.id || idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-[#583BE8] shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-[#0F172A] truncate">
                                  {doc.name}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400">
                                  {doc.type} • {doc.uploadedAt}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                doc.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : doc.status === 'Re-upload Requested'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : doc.status === 'Re-upload Submitted'
                                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                                  : doc.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {doc.status || 'Pending'}
                            </span>
                          </div>

                          {/* Rejection / Request Reason Callout */}
                          {doc.status !== 'Approved' && (doc.rejectionReason || doc.customReason || doc.internalNote) && (
                            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] space-y-1">
                              {doc.rejectionReason && (
                                <p className="font-bold text-amber-900">
                                  Reason: <span className="font-semibold">{doc.rejectionReason}</span>
                                  {doc.customReason ? ` (${doc.customReason})` : ''}
                                </p>
                              )}
                              {doc.internalNote && (
                                <p className="font-medium text-amber-800/80 text-[10px]">
                                  Admin Note: {doc.internalNote}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 justify-end">
                            {doc.fileUrl && doc.fileUrl !== '#' && (
                              <button
                                type="button"
                                onClick={() => handlePreviewDoc(doc.fileUrl)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-slate-400" />
                                <span>Preview</span>
                              </button>
                            )}
                            {doc.fileUrl && doc.fileUrl !== '#' && (
                              <button
                                type="button"
                                onClick={() => handleDownloadDoc(doc.fileUrl, doc.name)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3 text-slate-400" />
                                <span>Download</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── APPROVE DOCUMENTS PRIMARY BUTTON ── */}
                  <div className="pt-3 border-t border-slate-100">
                    {hasPendingDocs ? (
                      <button
                        type="button"
                        onClick={() => setIsApproveDocsModalOpen(true)}
                        disabled={isApprovingDocs}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isApprovingDocs ? 'Approving Documents...' : 'Approve Documents'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-black cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>All Documents Approved</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Verification' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                        Verification Scores
                      </h4>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Score: {activeData.complianceScore}/100
                      </span>
                    </div>

                    <div className="space-y-3 text-xs font-semibold text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Identity Verification</span>
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Passed
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Business Verification</span>
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Passed
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bank Settlement Account & IFSC</span>
                        <span
                          className={
                            activeData.bankDetails?.verified
                              ? 'text-emerald-600 font-extrabold flex items-center gap-1'
                              : 'text-amber-600 font-extrabold flex items-center gap-1'
                          }
                        >
                          {activeData.bankDetails?.verified ? (
                            <>
                              <ShieldCheck className="w-4 h-4" /> Passed
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" /> Under Audit
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tax & GST Verification</span>
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Passed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Activity' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Activity Audit Log ({activitiesList.length})
                  </h4>
                  {activitiesList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl">
                      No audit activities logged yet for this agency.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activitiesList.map((act, idx) => (
                        <div key={act.id || idx} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-[#0F172A]">{act.action}</p>
                            {act.notes && (
                              <p className="text-[11px] font-semibold text-slate-500">{act.notes}</p>
                            )}
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">
                              {act.timestamp} • By {act.adminName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── APPROVE DOCUMENTS CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {isApproveDocsModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => !isApprovingDocs && setIsApproveDocsModalOpen(false)}
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 z-60 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">
                    Approve Submitted Documents?
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                    This will approve all newly submitted and re-uploaded documents for this agency. The verification status of those documents will be updated immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApproveDocsModalOpen(false)}
                  disabled={isApprovingDocs}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproveDocs}
                  disabled={isApprovingDocs}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isApprovingDocs ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Documents</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
