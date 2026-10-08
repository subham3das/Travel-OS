import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Landmark,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

const ONBOARDING_TABS = [
  { id: 'all', label: 'All Sellers' },
  { id: 'SUBMITTED', label: 'Pending Review' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'SKIPPED', label: 'Skipped' },
];

export const AdminSellerOnboardingTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profilesData, setProfilesData] = useState<any>(null);

  // Action Modals state
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'reject' | 'details' | 'hold' | null;
    profile: any | null;
    reason?: string;
  }>({ type: null, profile: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get<any>('/admin/sellers/onboarding', {
        params: {
          status: activeTab === 'all' ? undefined : activeTab,
          search: searchTerm.trim() || undefined,
          page,
          limit: 10,
        },
      });
      setProfilesData(res.data);
    } catch (err: any) {
      console.warn('Failed to load seller profiles:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, page]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleApprove = async (profileId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.patch(`/admin/sellers/onboarding/${profileId}/approve`, {});
      showToast('Seller payout profile approved successfully! Route payouts enabled.');
      setActionModal({ type: null, profile: null });
      fetchProfiles();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to approve seller.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (profileId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please specify a rejection reason for the seller.');
      return;
    }
    try {
      setIsProcessing(true);
      await adminApiClient.patch(`/admin/sellers/onboarding/${profileId}/reject`, { reason });
      showToast('Seller payout profile rejected.');
      setActionModal({ type: null, profile: null });
      fetchProfiles();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to reject seller.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResync = async (profileId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/sellers/onboarding/${profileId}/sync`, {});
      showToast('Seller profile re-synchronized with Razorpay Route.');
      fetchProfiles();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to sync with Route.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleHold = async (profileId: string, hold: boolean, reason?: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.patch(`/admin/sellers/onboarding/${profileId}/payout-hold`, {
        hold,
        reason,
      });
      showToast(hold ? 'Payouts placed on HOLD for seller.' : 'Payout hold RELEASED.');
      setActionModal({ type: null, profile: null });
      fetchProfiles();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to update payout hold.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const profilesList = profilesData?.profiles || [];

  return (
    <div className="space-y-5 select-none font-sans">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Control Bar: Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {ONBOARDING_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchProfiles}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors self-end sm:self-auto cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search sellers by Business Name, Beneficiary, IFSC, or Linked Account ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#583BE8] transition-colors"
          />
        </div>
      </div>

      {/* Sellers Onboarding Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">
                <th className="py-3 px-4">Business / Seller</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4">Beneficiary & Account</th>
                <th className="py-3 px-4">IFSC</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Route & Linked Acc</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    <div className="w-6 h-6 border-2 border-[#583BE8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading seller onboarding profiles...
                  </td>
                </tr>
              ) : profilesList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    No seller payment profiles found.
                  </td>
                </tr>
              ) : (
                profilesList.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      <div>
                        <span>{p.businessName}</span>
                        <span className="block text-[10px] font-semibold text-slate-400">
                          {p.sellerType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 capitalize">
                      {p.businessType ? p.businessType.replace('_', ' ') : 'Proprietorship'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      {p.bankName || 'Commercial Bank'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900">{p.beneficiaryName}</span>
                        <span className="block font-mono text-[11px] text-slate-400">
                          {p.accountNumberMasked || '••••••••'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {p.ifscCode}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.status === 'APPROVED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : p.status === 'REJECTED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                          Rejected
                        </span>
                      ) : p.status === 'SKIPPED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">
                          Skipped
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                          Under Review
                        </span>
                      )}
                      {p.payoutsHeld && (
                        <span className="block mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          ON HOLD
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.routeEnabled ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-[#583BE8]">
                            <ShieldCheck className="w-3 h-3 text-[#583BE8]" />
                            <span>Route Active</span>
                          </span>
                          {p.razorpayLinkedAccountId && (
                            <span className="block font-mono text-[9px] text-slate-400 mt-0.5">
                              {p.razorpayLinkedAccountId}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {p.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(p.id)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black text-[10px] transition-colors cursor-pointer"
                            title="Approve Payouts"
                          >
                            Approve
                          </button>
                        )}
                        {p.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'reject', profile: p, reason: '' })}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-black text-[10px] transition-colors cursor-pointer"
                            title="Reject Account"
                          >
                            Reject
                          </button>
                        )}
                        {p.payoutsHeld ? (
                          <button
                            type="button"
                            onClick={() => handleToggleHold(p.id, false)}
                            disabled={isProcessing}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-black text-[10px] transition-colors cursor-pointer"
                            title="Release Payout Hold"
                          >
                            Release Hold
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'hold', profile: p, reason: '' })}
                            disabled={isProcessing}
                            className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-black text-[10px] transition-colors cursor-pointer"
                            title="Place Payouts on Hold"
                          >
                            Hold
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResync(p.id)}
                          disabled={isProcessing}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Re-sync with Razorpay Route"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {profilesData && profilesData.totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50/50">
            <span>
              Page {profilesData.page} of {profilesData.totalPages} ({profilesData.total} profiles)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= profilesData.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {actionModal.type === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Reject Payout Account</h3>
              <button
                onClick={() => setActionModal({ type: null, profile: null })}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Provide a clear reason for rejection so the seller can correct their bank account details:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Account name mismatch with registered legal entity."
              value={actionModal.reason || ''}
              onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModal({ type: null, profile: null })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(actionModal.profile?.id, actionModal.reason || '')}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hold Modal */}
      {actionModal.type === 'hold' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-amber-900">Place Seller Payouts on Hold</h3>
              <button
                onClick={() => setActionModal({ type: null, profile: null })}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Freezes future settlement transfers to this seller's bank account while keeping their agency account active. State reason:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Investigation into multiple recent customer chargebacks or KYC verification update pending."
              value={actionModal.reason || ''}
              onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModal({ type: null, profile: null })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleHold(actionModal.profile?.id, true, actionModal.reason || 'Admin hold')}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
