import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Archive,
  ShieldAlert,
  Ban,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Eye,
  Check,
  ChevronRight,
  X,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

export const AdminPaymentOperationsWorkspace: React.FC = () => {
  const [opsTab, setOpsTab] = useState<'metrics' | 'retry_queue' | 'dlq' | 'holds'>('metrics');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  // Search state (Phase 7 Universal Search)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any | null>(null);

  // Retry Queue state
  const [retryQueue, setRetryQueue] = useState<any[]>([]);
  const [retryStats, setRetryStats] = useState<any>(null);
  const [retryPage, setRetryPage] = useState(1);
  const [retryTotalPages, setRetryTotalPages] = useState(1);
  const [retryStatusFilter, setRetryStatusFilter] = useState('ALL');

  // DLQ state
  const [dlqItems, setDlqItems] = useState<any[]>([]);
  const [selectedPayload, setSelectedPayload] = useState<any | null>(null);

  // Hold Modal state
  const [holdModal, setHoldModal] = useState<{
    isOpen: boolean;
    sellerId: string;
    sellerName: string;
    action: 'place' | 'release';
  }>({
    isOpen: false,
    sellerId: '',
    sellerName: '',
    action: 'place',
  });
  const [holdReason, setHoldReason] = useState('KYC review');
  const [holdCustomReason, setHoldCustomReason] = useState('');

  // Manual Trigger Input Modal
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'transfer' | 'refund' | 'settlement';
    id: string;
  }>({
    isOpen: false,
    type: 'transfer',
    id: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get<any>('/admin/operations/metrics');
      if (res.data?.success) {
        setMetrics(res.data.data);
      }
    } catch (err: any) {
      console.warn('Failed to load operations metrics:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRetryQueue = useCallback(async () => {
    try {
      const res = await adminApiClient.get<any>('/admin/operations/retry-queue', {
        params: {
          status: retryStatusFilter === 'ALL' ? undefined : retryStatusFilter,
          page: retryPage,
          limit: 15,
        },
      });
      if (res.data?.success) {
        setRetryQueue(res.data.data.items || []);
        setRetryStats(res.data.data.stats);
        setRetryTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err: any) {
      console.warn('Failed to fetch retry queue:', err.message);
    }
  }, [retryStatusFilter, retryPage]);

  const fetchDLQ = useCallback(async () => {
    try {
      const res = await adminApiClient.get<any>('/admin/webhooks/dlq', {
        params: { page: 1, limit: 25 },
      });
      if (res.data?.success) {
        setDlqItems(res.data.data.items || res.data.data.dlqItems || []);
      }
    } catch (err: any) {
      console.warn('Failed to fetch DLQ items:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchRetryQueue();
    fetchDLQ();
  }, [fetchMetrics, fetchRetryQueue, fetchDLQ]);

  // Execute Global Search (Phase 7)
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      setIsSearching(true);
      const res = await adminApiClient.get<any>('/admin/operations/search', {
        params: { q: searchQuery.trim() },
      });
      if (res.data?.success) {
        setSearchResults(res.data.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // Actions
  const handleManualRetry = async (retryId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/operations/retry-queue/${retryId}/retry`, {});
      showToast(`Retry ${retryId} executed successfully.`);
      fetchRetryQueue();
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message || 'Retry execution failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRetry = async (retryId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/operations/retry-queue/${retryId}/cancel`, {});
      showToast(`Retry ${retryId} cancelled.`);
      fetchRetryQueue();
    } catch (err: any) {
      showToast(err.message || 'Cancellation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplayWebhook = async (eventId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/operations/webhooks/replay/${eventId}`, {});
      showToast(`Webhook ${eventId} successfully replayed!`);
      fetchDLQ();
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message || 'Webhook replay failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchiveDLQ = async (eventId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/operations/dlq/${eventId}/archive`, {
        notes: 'Archived via Operations Console',
      });
      showToast(`DLQ event ${eventId} archived.`);
      fetchDLQ();
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message || 'Archive failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteActionModal = async () => {
    if (!actionModal.id.trim()) return;
    try {
      setIsProcessing(true);
      if (actionModal.type === 'transfer') {
        await adminApiClient.post(`/admin/operations/transfers/${actionModal.id.trim()}/retry`, {});
        showToast(`Transfer ${actionModal.id} retry dispatched.`);
      } else if (actionModal.type === 'refund') {
        await adminApiClient.post(`/admin/operations/refunds/${actionModal.id.trim()}/retry`, {});
        showToast(`Refund ${actionModal.id} retry dispatched.`);
      } else if (actionModal.type === 'settlement') {
        await adminApiClient.post(`/admin/operations/settlements/${actionModal.id.trim()}/sync`, {});
        showToast(`Settlement sync ${actionModal.id} executed.`);
      }
      setActionModal({ isOpen: false, type: 'transfer', id: '' });
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteHold = async () => {
    try {
      setIsProcessing(true);
      const finalReason = holdReason === 'Other' ? holdCustomReason : holdReason;
      if (holdModal.action === 'place') {
        await adminApiClient.post(`/admin/operations/sellers/${holdModal.sellerId}/hold`, {
          reason: finalReason || 'Manual review',
        });
        showToast(`Payout hold placed on seller.`);
      } else {
        await adminApiClient.post(`/admin/operations/sellers/${holdModal.sellerId}/release-hold`, {
          reason: finalReason || 'Hold released by administrator',
        });
        showToast(`Payout hold released.`);
      }
      setHoldModal({ isOpen: false, sellerId: '', sellerName: '', action: 'place' });
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message || 'Failed to update hold status', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-black flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── 1. GLOBAL FINANCE SEARCH (PHASE 7) ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6356E5]" />
              Universal Global Finance Search
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Universal search across Internal Payment ID, Booking ID, Car Booking ID, Customers, Sellers, Transfers, Settlements, UTR, and Gateway IDs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchMetrics();
                fetchRetryQueue();
                fetchDLQ();
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              title="Refresh Operations Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Payment ID, BK-XXXX, Transfer ID, Settlement ID, UTR, Customer Email/Name, or Gateway ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
          {searchResults && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults(null);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>

        {/* Search Results Display */}
        {searchResults && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Found {searchResults.totalMatches} related financial records</span>
            </div>

            {searchResults.totalMatches === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No matching financial records found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Payments */}
                {searchResults.results.payments?.map((p: any) => (
                  <div key={p._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        Payment
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{(p.amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">ID: {p.paymentId || p._id}</div>
                    <div className="text-[11px] text-slate-500">Customer: {p.customerName || p.customerEmail || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400 truncate">Gateway: {p.gatewayPaymentId || p.orderId || 'N/A'}</div>
                  </div>
                ))}

                {/* Bookings */}
                {searchResults.results.bookings?.map((b: any) => (
                  <div key={b._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        Booking
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">Ref: {b.bookingId}</div>
                    <div className="text-[11px] text-slate-500">Partner: {b.agencyName || 'Agency'}</div>
                    <div className="text-[10px] text-slate-400 truncate">Customer: {b.customerName} ({b.customerEmail})</div>
                  </div>
                ))}

                {/* Transfers */}
                {searchResults.results.transfers?.map((t: any) => (
                  <div key={t._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Transfer
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{(t.transferAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">Ref: {t.transferId}</div>
                    <div className="text-[11px] text-slate-500">Seller: {t.sellerName}</div>
                    <div className="text-[10px] text-slate-400">Gateway: {t.gatewayTransferId || 'Pending'}</div>
                  </div>
                ))}

                {/* Settlements */}
                {searchResults.results.settlements?.map((s: any) => (
                  <div key={s._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        Settlement
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{(s.netSettledAmount || s.amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">Ref: {s.settlementId}</div>
                    <div className="text-[11px] text-slate-500">UTR: {s.utr || 'Pending bank delivery'}</div>
                    <div className="text-[10px] text-slate-400">Status: {s.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. METRICS DASHBOARD CARDS (PHASE 6) ── */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Gateway Health */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gateway Health</div>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  metrics.gatewayHealth === 'HEALTHY'
                    ? 'bg-emerald-500 animate-pulse'
                    : metrics.gatewayHealth === 'DEGRADED'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-sm font-black text-slate-900">{metrics.gatewayHealth}</span>
            </div>
            <div className="text-[10px] text-slate-400">Razorpay Route Core</div>
          </div>

          {/* Webhook Queue */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Webhook Queue</div>
            <div className="text-lg font-black text-slate-900">{metrics.webhookQueue} queued</div>
            <div className="text-[10px] text-slate-400">Avg {metrics.averageProcessingTime}</div>
          </div>

          {/* DLQ Count */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dead Letter Queue</div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-rose-600">{metrics.dlqCount}</span>
              {metrics.dlqCount > 0 && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">REVIEW</span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">Unresolved events</div>
          </div>

          {/* Retry Queue */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Retry Queue</div>
            <div className="text-lg font-black text-slate-900">{metrics.retryQueue}</div>
            <div className="text-[10px] text-slate-400">Active background retries</div>
          </div>

          {/* Transfer & Refund Success % */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Transfer Success</div>
            <div className="text-lg font-black text-emerald-600">{metrics.transferSuccessRate}%</div>
            <div className="text-[10px] text-slate-400">Refunds: {metrics.refundSuccessRate}%</div>
          </div>

          {/* Today's GMV */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Today's GMV</div>
            <div className="text-sm font-black text-[#6356E5]">₹{metrics.todaysGMV.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400">Comm: ₹{metrics.todaysCommission.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}

      {/* ── 3. OPERATIONS ACTION BAR (PHASE 9) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-3xl">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-black text-white">Manual Operational Actions</h3>
            <p className="text-[11px] text-slate-400">Execute verified administrative operations with audit logging</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActionModal({ isOpen: true, type: 'transfer', id: '' })}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            Retry Transfer
          </button>
          <button
            onClick={() => setActionModal({ isOpen: true, type: 'refund', id: '' })}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            Retry Refund
          </button>
          <button
            onClick={() => setActionModal({ isOpen: true, type: 'settlement', id: '' })}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            Sync Settlement
          </button>
          <button
            onClick={() => setHoldModal({ isOpen: true, sellerId: '', sellerName: '', action: 'place' })}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3" />
            <span>Payout Hold</span>
          </button>
        </div>
      </div>

      {/* ── 4. SUB-NAVIGATION TABS (PHASE 9) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setOpsTab('metrics')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            opsTab === 'metrics' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setOpsTab('retry_queue')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            opsTab === 'retry_queue' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Centralized Retry Queue</span>
          {retryQueue.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-900 font-bold">
              {retryQueue.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setOpsTab('dlq')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            opsTab === 'dlq' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Dead Letter Queue (DLQ)</span>
          {dlqItems.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
              {dlqItems.length}
            </span>
          )}
        </button>
      </div>

      {/* ── SUB-TAB 1: OPERATIONS OVERVIEW & ALERTS ── */}
      {opsTab === 'metrics' && (
        <div className="space-y-4">
          {/* Active Alerts */}
          {metrics?.alerts && metrics.alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Proactive Operational Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {metrics.alerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                        : alert.severity === 'HIGH'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-blue-50/70 border-blue-200 text-blue-900'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-xs font-black">{alert.title}</div>
                      <div className="text-xs leading-relaxed opacity-90">{alert.message}</div>
                      <div className="text-[11px] font-semibold opacity-75">Action: {alert.suggestedAction}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                SLA & Delivery Speed
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Avg Settlement Time</span>
                  <span className="font-bold text-slate-900">{metrics?.averageSettlementTime || '24 hours'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Delayed Settlements</span>
                  <span className="font-bold text-amber-600">{metrics?.delayedSettlements || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Delayed Amount</span>
                  <span className="font-bold text-slate-900">₹{(metrics?.delayedSettlementsAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                Transfer Pipeline Status
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pending Transfers</span>
                  <span className="font-bold text-slate-900">{metrics?.pendingTransfers || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Processing In Gateway</span>
                  <span className="font-bold text-indigo-600">{metrics?.processingTransfers || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Failed Transfers</span>
                  <span className="font-bold text-rose-600">{metrics?.failedTransfers || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Reliability Metrics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Webhook Success Rate</span>
                  <span className="font-bold text-emerald-600">{metrics?.webhookSuccessRate || 100}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Verified Sellers</span>
                  <span className="font-bold text-slate-900">{metrics?.totalActiveSellers || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Settled Volume</span>
                  <span className="font-bold text-slate-900">₹{(metrics?.totalSettledAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: CENTRALIZED RETRY QUEUE (PHASE 3 & 9) ── */}
      {opsTab === 'retry_queue' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-900">Centralized Automatic Retry Queue</h3>
              <p className="text-[11px] text-slate-500">Exponential backoff with jitter and idempotency protection</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={retryStatusFilter}
                onChange={(e) => {
                  setRetryStatusFilter(e.target.value);
                  setRetryPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="EXHAUSTED">Exhausted</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Retry ID</th>
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Attempt</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {retryQueue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      No items currently in retry queue.
                    </td>
                  </tr>
                ) : (
                  retryQueue.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-[11px]">
                        {item.retryId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.operationType}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {item.entityId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{item.retryCount}</span> / {item.maxRetries}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'SCHEDULED'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'IN_PROGRESS'
                              ? 'bg-indigo-100 text-indigo-800'
                              : item.status === 'EXHAUSTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {item.nextAttemptAt ? new Date(item.nextAttemptAt).toLocaleTimeString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {item.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleManualRetry(item.retryId)}
                              disabled={isProcessing}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Retry Now
                            </button>
                          )}
                          {item.status === 'SCHEDULED' && (
                            <button
                              onClick={() => handleCancelRetry(item.retryId)}
                              disabled={isProcessing}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: DEAD LETTER QUEUE (PHASE 2 & 9) ── */}
      {opsTab === 'dlq' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900">Dead Letter Queue (DLQ) Management</h3>
              <p className="text-[11px] text-slate-500">Unprocessed events moved to DLQ after 3 failed retries. Review, replay, or archive.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Failure Reason</th>
                  <th className="py-3 px-4">Retries</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dlqItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Zero events in Dead Letter Queue. Webhook pipeline running cleanly!
                    </td>
                  </tr>
                ) : (
                  dlqItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-[11px]">
                        {item.eventId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.event}
                      </td>
                      <td className="py-3 px-4 text-rose-600 text-[11px] max-w-xs truncate" title={item.failureReason || item.dlqReason}>
                        {item.failureReason || item.dlqReason || 'Unknown error'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.retryCount || 3}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                          {item.status || item.dlqStatus || 'DLQ'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleReplayWebhook(item.eventId)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-[#6356E5]/10 hover:bg-[#6356E5]/20 text-[#6356E5] font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay</span>
                          </button>
                          <button
                            onClick={() => handleArchiveDLQ(item.eventId)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Archive className="w-3 h-3" />
                            <span>Archive</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: MANUAL ACTION TRIGGER ── */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 capitalize">
                Retry {actionModal.type} Operation
              </h3>
              <button
                onClick={() => setActionModal({ isOpen: false, type: 'transfer', id: '' })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Provide the ID to re-dispatch this financial operation through idempotent retry infrastructure:
            </p>
            <input
              type="text"
              value={actionModal.id}
              onChange={(e) => setActionModal((prev) => ({ ...prev, id: e.target.value }))}
              placeholder={`Enter ${actionModal.type} ID...`}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6356E5]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModal({ isOpen: false, type: 'transfer', id: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteActionModal}
                disabled={!actionModal.id.trim() || isProcessing}
                className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold hover:bg-[#5244e0] disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Execute Retry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PAYOUT HOLD MANAGEMENT (PHASE 5) ── */}
      {holdModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500" />
                {holdModal.action === 'place' ? 'Place Payout Hold' : 'Release Payout Hold'}
              </h3>
              <button
                onClick={() => setHoldModal({ isOpen: false, sellerId: '', sellerName: '', action: 'place' })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {holdModal.action === 'place'
                ? 'Placing a hold blocks all future payouts to this seller while keeping historical settlements immutable.'
                : 'Releasing this hold restores scheduled payouts to this partner.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700">Seller / Partner ID</label>
              <input
                type="text"
                value={holdModal.sellerId}
                onChange={(e) => setHoldModal((prev) => ({ ...prev, sellerId: e.target.value }))}
                placeholder="Enter seller ObjectId or Agency ID..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            {holdModal.action === 'place' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700">Hold Reason</label>
                <select
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6356E5]"
                >
                  <option value="KYC review">KYC review</option>
                  <option value="Fraud investigation">Fraud investigation</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Chargeback">Chargeback</option>
                  <option value="Manual review">Manual review</option>
                  <option value="Other">Other reason...</option>
                </select>

                {holdReason === 'Other' && (
                  <input
                    type="text"
                    value={holdCustomReason}
                    onChange={(e) => setHoldCustomReason(e.target.value)}
                    placeholder="Specify hold reason..."
                    className="w-full mt-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6356E5]"
                  />
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setHoldModal({ isOpen: false, sellerId: '', sellerName: '', action: 'place' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteHold}
                disabled={!holdModal.sellerId.trim() || isProcessing}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all disabled:opacity-50 ${
                  holdModal.action === 'place'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isProcessing
                  ? 'Saving...'
                  : holdModal.action === 'place'
                  ? 'Confirm Hold'
                  : 'Release Hold'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
