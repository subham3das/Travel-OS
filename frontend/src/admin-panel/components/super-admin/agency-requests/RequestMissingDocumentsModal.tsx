import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  AlertTriangle,
  CheckSquare,
  Square,
  Eye,
  Send,
  HelpCircle,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { AgencyRequestItem, DocumentItem } from '../../../types/agencyRequest';

export interface RequestedDocConfig {
  documentId: string;
  documentName: string;
  documentType: string;
  previousStatus: string;
  reason: string;
  customReason: string;
  internalNote: string;
}

interface RequestMissingDocumentsModalProps {
  isOpen: boolean;
  request: AgencyRequestItem | null;
  isProcessing?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    requestedDocuments: Array<{
      documentId: string;
      documentName: string;
      documentType: string;
      reason: string;
      customReason?: string;
      internalNote?: string;
    }>;
    agencyMessage?: string;
  }) => void;
}

export const REASON_OPTIONS = [
  'Blurry Document',
  'Incorrect Information',
  'Expired Document',
  'Missing Pages',
  'Invalid Document',
  'Mismatch Found',
  'Verification Failed',
  'Other',
];

export const RequestMissingDocumentsModal: React.FC<RequestMissingDocumentsModalProps> = ({
  isOpen,
  request,
  isProcessing = false,
  onClose,
  onSubmit,
}) => {
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docConfigs, setDocConfigs] = useState<Record<string, RequestedDocConfig>>({});
  const [agencyMessage, setAgencyMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize from request.documents
  useEffect(() => {
    if (request && isOpen) {
      const initialConfigs: Record<string, RequestedDocConfig> = {};
      const docs = request.documents || [];

      docs.forEach((doc) => {
        initialConfigs[doc.id] = {
          documentId: doc.id,
          documentName: doc.name,
          documentType: doc.type,
          previousStatus: doc.status || 'Pending',
          reason: doc.rejectionReason || 'Blurry Document',
          customReason: doc.customReason || '',
          internalNote: doc.internalNote || '',
        };
      });

      setDocConfigs(initialConfigs);
      // Preselect any document already in 'Re-upload Requested' or 'Rejected'
      const preselected = docs
        .filter((d) => d.status === 'Re-upload Requested' || d.status === 'Rejected')
        .map((d) => d.id);
      setSelectedDocIds(preselected.length > 0 ? preselected : docs.length > 0 ? [docs[0].id] : []);
      setAgencyMessage(request.documentRequestMessage || '');
      setValidationError(null);
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  const documents = request.documents || [];

  const handleToggleDoc = (doc: DocumentItem) => {
    setSelectedDocIds((prev) => {
      if (prev.includes(doc.id)) {
        return prev.filter((id) => id !== doc.id);
      } else {
        return [...prev, doc.id];
      }
    });
    setValidationError(null);
  };

  const handleToggleAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d.id));
    }
    setValidationError(null);
  };

  const handleConfigChange = (
    docId: string,
    field: 'reason' | 'customReason' | 'internalNote',
    value: string
  ) => {
    setDocConfigs((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
      },
    }));
  };

  const handlePreviewDoc = (fileUrl?: string) => {
    if (fileUrl && fileUrl !== '#') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocIds.length === 0) {
      setValidationError('Please select at least one document to request for re-upload.');
      return;
    }

    // Validate that if "Other" is selected, customReason is provided
    for (const docId of selectedDocIds) {
      const config = docConfigs[docId];
      if (config?.reason === 'Other' && !config.customReason?.trim()) {
        setValidationError(`Please specify a custom reason for "${config.documentName}".`);
        return;
      }
    }

    const payload = {
      requestedDocuments: selectedDocIds.map((id) => {
        const config = docConfigs[id];
        return {
          documentId: config.documentId,
          documentName: config.documentName,
          documentType: config.documentType,
          reason: config.reason,
          customReason: config.reason === 'Other' ? config.customReason : undefined,
          internalNote: config.internalNote?.trim() || undefined,
        };
      }),
      agencyMessage: agencyMessage.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl z-50 border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                    Request Missing Documents
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                    {request.applicationId}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Select the document(s) that require re-upload for{' '}
                  <span className="font-bold text-[#0F172A]">{request.agencyName}</span> and provide a
                  reason for each request.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Validation Error Banner */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Section 1: Uploaded Documents from MongoDB */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#583BE8]" />
                  Uploaded Documents ({documents.length})
                </h3>

                {documents.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-xs font-bold text-[#583BE8] hover:text-[#472ecc] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {selectedDocIds.length === documents.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {documents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs font-bold text-slate-400">
                  No documents found on this agency application.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {documents.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleToggleDoc(doc)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="shrink-0 text-amber-600">
                            {isSelected ? (
                              <CheckSquare className="w-4.5 h-4.5 fill-amber-500 text-white" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-slate-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#0F172A] truncate">
                              {doc.name}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 truncate">
                              {doc.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                              doc.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'Re-upload Requested'
                                ? 'bg-amber-100 text-amber-800'
                                : doc.status === 'Re-upload Submitted'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {doc.status || 'Pending'}
                          </span>

                          {doc.fileUrl && doc.fileUrl !== '#' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewDoc(doc.fileUrl);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                              title="Preview Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Specific Re-upload Configuration for Selected Documents */}
            {selectedDocIds.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Specify Rejection Reasons & Notes ({selectedDocIds.length} Selected)
                </h3>

                <div className="space-y-3">
                  {selectedDocIds.map((docId) => {
                    const config = docConfigs[docId];
                    if (!config) return null;

                    return (
                      <div
                        key={docId}
                        className="p-4 rounded-2xl bg-[#F8F9FC] border border-amber-200/80 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <h4 className="text-xs font-black text-[#0F172A]">
                              {config.documentName}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {config.documentType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Reason Dropdown */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">
                              Rejection Reason <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={config.reason}
                                onChange={(e) =>
                                  handleConfigChange(docId, 'reason', e.target.value)
                                }
                                className="w-full h-9 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] appearance-none cursor-pointer"
                              >
                                {REASON_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                            </div>
                          </div>

                          {/* Optional Internal Admin Note */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              Internal Admin Note
                              <span className="text-[10px] text-slate-400 font-normal">
                                (Admin Only)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={config.internalNote}
                              onChange={(e) =>
                                handleConfigChange(docId, 'internalNote', e.target.value)
                              }
                              placeholder="e.g. Needs seal on page 2"
                              className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8]"
                            />
                          </div>
                        </div>

                        {/* Custom Reason if "Other" is selected */}
                        {config.reason === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-1"
                          >
                            <label className="text-[11px] font-bold text-slate-600">
                              Custom Reason <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={config.customReason}
                              onChange={(e) =>
                                handleConfigChange(docId, 'customReason', e.target.value)
                              }
                              placeholder="Enter custom rejection reason for this document"
                              className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8]"
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Overall Message to Agency */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center justify-between">
                <span>Message to Agency</span>
                <span className="text-[10px] font-bold text-slate-400 normal-case">
                  (Visible in notification email & agency portal)
                </span>
              </label>
              <textarea
                rows={3}
                value={agencyMessage}
                onChange={(e) => setAgencyMessage(e.target.value)}
                placeholder="e.g. Please upload a clearer copy of your GST certificate and the latest 3-month commercial bank statement."
                className="w-full p-3 rounded-2xl bg-[#F8F9FC] border border-slate-200 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] resize-none"
              />
            </div>

            {/* Submission Summary */}
            {selectedDocIds.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-extrabold text-slate-700">
                    Documents Requested:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedDocIds.map((id) => (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold"
                      >
                        ✓ {docConfigs[id]?.documentName || 'Document'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-black text-[#583BE8]">
                    Total: {selectedDocIds.length}
                  </span>
                </div>
              </div>
            )}
          </form>

          {/* Modal Footer */}
          <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing || selectedDocIds.length === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isProcessing ? 'Sending Request...' : 'Send Request'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
