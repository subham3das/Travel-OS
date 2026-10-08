import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UploadCloud,
  Search,
  Filter,
  RefreshCw,
  FileText,
  ExternalLink,
  X,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

const DISPUTE_STATUS_TABS = [
  { id: 'all', label: 'All Disputes' },
  { id: 'ACTION_REQUIRED', label: 'Action Required' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'WON', label: 'Won' },
  { id: 'LOST', label: 'Lost' },
  { id: 'CLOSED', label: 'Closed' },
];

export const AdminDisputesWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Modal States
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Evidence Form State
  const [evidenceDoc, setEvidenceDoc] = useState({
    documentType: 'CUSTOMER_COMMUNICATION',
    documentUrl: '',
    description: '',
  });

  // Status Form State
  const [statusForm, setStatusForm] = useState({
    status: 'WON',
    notes: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get<any>('/admin/disputes', {
        params: {
          status: activeTab === 'all' ? undefined : activeTab,
          search: search.trim() || undefined,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      if (res.data?.success) {
        setDisputes(res.data.data.disputes || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data.data.pagination.total,
          totalPages: res.data.data.pagination.totalPages,
        }));
      }
    } catch (err: any) {
      console.warn('Failed to load disputes:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !evidenceDoc.documentUrl) {
      alert('Please provide a valid document URL or upload link.');
      return;
    }
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/disputes/${selectedDispute._id}/evidence`, {
        evidence: [evidenceDoc],
      });
      showToast('Evidence submitted to payment processor.');
      setIsEvidenceModalOpen(false);
      setEvidenceDoc({ documentType: 'CUSTOMER_COMMUNICATION', documentUrl: '', description: '' });
      fetchDisputes();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to submit evidence', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    try {
      setIsProcessing(true);
      await adminApiClient.patch(`/admin/disputes/${selectedDispute._id}/status`, {
        status: statusForm.status,
        result: statusForm.status === 'WON' ? 'Dispute won in favor of platform/seller' : undefined,
        notes: statusForm.notes,
      });
      showToast(`Dispute status updated to ${statusForm.status}`);
      setIsStatusModalOpen(false);
      fetchDisputes();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to update status', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Required
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'WON':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> Won
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40">
            <XCircle className="w-3.5 h-3.5" /> Lost
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl shadow-lg border flex items-center justify-between gap-3 text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              Chargebacks & Dispute Management
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track payment disputes, submit merchant evidence before bank deadlines, and protect platform margins.
            </p>
          </div>
          <button
            onClick={fetchDisputes}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Disputes
          </button>
        </div>

        {/* Tab Filters & Search */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {DISPUTE_STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Dispute ID, Booking..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Dispute / Booking</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Reason / Category</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Evidence</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                    Loading chargebacks & disputes...
                  </td>
                </tr>
              ) : disputes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    No chargebacks or disputes found.
                  </td>
                </tr>
              ) : (
                disputes.map((dispute) => {
                  const deadlineDate = dispute.deadline ? new Date(dispute.deadline) : null;
                  const isExpiringSoon =
                    deadlineDate &&
                    deadlineDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 &&
                    deadlineDate.getTime() > Date.now();

                  return (
                    <tr
                      key={dispute._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {dispute.disputeRef}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Booking: {dispute.bookingId?.bookingReference || dispute.bookingId?._id || 'N/A'}
                        </div>
                        {dispute.razorpayDisputeId && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Gateway: {dispute.razorpayDisputeId}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          ₹{Number(dispute.amount).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {dispute.reason}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Category: {dispute.category || 'General'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {deadlineDate ? (
                          <div className="flex flex-col">
                            <span
                              className={`text-[11px] font-semibold ${
                                isExpiringSoon
                                  ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {deadlineDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {isExpiringSoon && (
                              <span className="text-[10px] text-rose-500 font-medium">Urgent</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(dispute.status)}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          {dispute.evidence?.length || 0} Docs
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setIsEvidenceModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors"
                          >
                            Submit Evidence
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setStatusForm({ status: dispute.status, notes: '' });
                              setIsStatusModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Evidence Modal */}
      <AnimatePresence>
        {isEvidenceModalOpen && selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-rose-600" />
                  Submit Dispute Evidence ({selectedDispute.disputeRef})
                </h3>
                <button
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitEvidence} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Category
                  </label>
                  <select
                    value={evidenceDoc.documentType}
                    onChange={(e) => setEvidenceDoc((d) => ({ ...d, documentType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="CUSTOMER_COMMUNICATION">Customer Communication / Chat Logs</option>
                    <option value="PROOF_OF_SERVICE">Proof of Service / Ticket / Voucher</option>
                    <option value="CANCELLATION_POLICY">Signed Agreement / Cancellation Policy</option>
                    <option value="REFUND_CONFIRMATION">Prior Refund or Settlement Proof</option>
                    <option value="OTHER">Other Supporting Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document URL / Secure Cloud Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://apnatrip-storage.s3.amazonaws.com/evidence/..."
                    value={evidenceDoc.documentUrl}
                    onChange={(e) => setEvidenceDoc((d) => ({ ...d, documentUrl: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Context for Acquiring Bank
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how this evidence refutes the customer chargeback claim..."
                    value={evidenceDoc.description}
                    onChange={(e) => setEvidenceDoc((d) => ({ ...d, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {isProcessing ? 'Submitting...' : 'Submit Evidence'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Status Modal */}
      <AnimatePresence>
        {isStatusModalOpen && selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Update Dispute Outcome
                </h3>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Outcome Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm((s) => ({ ...s, status: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="UNDER_REVIEW">Under Review by Razorpay / Bank</option>
                    <option value="WON">Won (Funds retained / returned)</option>
                    <option value="LOST">Lost (Chargeback finalized against seller)</option>
                    <option value="CLOSED">Closed (Settled out of band)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Audit Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter reason or bank arbitration notes..."
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm((s) => ({ ...s, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? 'Updating...' : 'Save Status'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
