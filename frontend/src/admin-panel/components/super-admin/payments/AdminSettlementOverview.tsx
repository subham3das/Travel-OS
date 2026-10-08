import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Activity,
  History,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

export const AdminSettlementOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'audit'>('overview');

  // Overview Data
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [reconciliationResult, setReconciliationResult] = useState<any | null>(null);

  // Monitoring Data
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);

  // Audit Logs Data
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);

  // Action states for replacement approval
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'monitoring') {
      loadMonitoring();
    } else if (activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [activeTab, auditPage, auditSearch]);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get<any>('/admin/settlements/overview');
      setData(res.data);
    } catch (err: any) {
      console.warn('Failed to load admin settlements:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoring = async () => {
    try {
      setMonitoringLoading(true);
      const res = await adminApiClient.get<any>('/admin/settlements/monitoring');
      setMonitoringData(res.data);
    } catch (err: any) {
      console.warn('Failed to load monitoring metrics:', err.message);
    } finally {
      setMonitoringLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const res = await adminApiClient.get<any>('/admin/settlements/audit-logs', {
        params: {
          search: auditSearch.trim() || undefined,
          page: auditPage,
          limit: 20,
        },
      });
      setAuditLogs(res.data?.events || []);
      setAuditTotalPages(res.data?.totalPages || 1);
    } catch (err: any) {
      console.warn('Failed to load audit logs:', err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleRunReconciliation = async () => {
    try {
      setReconciling(true);
      const res = await adminApiClient.post<any>('/admin/settlements/reconcile', {});
      setReconciliationResult(res.data);
      loadOverview();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Reconciliation failed');
    } finally {
      setReconciling(false);
    }
  };

  const handleApproveReplacement = async (sellerId: string) => {
    try {
      setActionLoading(sellerId);
      await adminApiClient.post(`/admin/sellers/payment-profile/${sellerId}/replace-approve`, {
        sellerType: 'Agency',
      });
      alert('Payout account replacement approved and updated.');
      loadOverview();
      if (activeTab === 'monitoring') loadMonitoring();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectReplacement = async (sellerId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    try {
      setActionLoading(sellerId);
      await adminApiClient.post(`/admin/sellers/payment-profile/${sellerId}/replace-reject`, {
        sellerType: 'Agency',
        reason,
      });
      alert('Payout account replacement rejected.');
      loadOverview();
      if (activeTab === 'monitoring') loadMonitoring();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const overviewCards = data?.overviewCards || [
    { id: 'today', title: "Today's Revenue", formattedAmount: '₹0', badge: 'Live', color: 'emerald' },
    { id: 'monthly', title: 'Monthly Revenue', formattedAmount: '₹0', badge: 'Month', color: 'purple' },
    { id: 'pending', title: 'Pending Transfers', formattedAmount: '₹0', badge: 'Pending', color: 'amber' },
    { id: 'transferred', title: 'Transferred to Sellers', formattedAmount: '₹0', badge: 'Transferred', color: 'indigo' },
    { id: 'failed', title: 'Failed Transfers', formattedAmount: '₹0', badge: 'Action Required', color: 'rose' },
    { id: 'success_rate', title: 'Success Rate', formattedAmount: '100%', badge: 'Health', color: 'emerald' },
  ];

  const agencyBreakdown = data?.agencyBreakdown || [];

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header with Navigation Tabs & Reconciliation Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#583BE8]">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0F172A]">Razorpay Route Marketplace Settlement Engine</h3>
            <p className="text-xs font-semibold text-slate-400">
              Platform split fee reconciliation, SLA telemetry, and immutable ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Sub-tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'monitoring'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>SLA Health</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'audit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Ledger</span>
            </button>
          </div>

          <button
            type="button"
            onClick={activeTab === 'overview' ? loadOverview : activeTab === 'monitoring' ? loadMonitoring : loadAuditLogs}
            disabled={loading || monitoringLoading || auditLoading}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
            title="Refresh View"
          >
            <RefreshCw className={`w-4 h-4 ${loading || monitoringLoading || auditLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleRunReconciliation}
            disabled={reconciling}
            className="px-4 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#472ec4] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{reconciling ? 'Reconciling...' : 'Run Reconciliation'}</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Reconciliation Result Alert */}
          {reconciliationResult && (
            <div
              className={`p-4 rounded-3xl border text-xs font-bold space-y-1.5 ${
                reconciliationResult.mismatchCount === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black">
                  {reconciliationResult.mismatchCount === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Daily Reconciliation Report</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(reconciliationResult.executedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-600 font-semibold">
                Checked <strong>{reconciliationResult.totalChecked}</strong> records. Matches:{' '}
                <strong className="text-emerald-700">{reconciliationResult.matchedCount}</strong> • Discrepancies:{' '}
                <strong className={reconciliationResult.mismatchCount > 0 ? 'text-rose-600' : 'text-slate-600'}>
                  {reconciliationResult.mismatchCount}
                </strong>
              </p>
            </div>
          )}

          {/* Overview KPI Cards (6 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {overviewCards.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 truncate">{c.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-700">
                    {c.badge}
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#0F172A] tracking-tight">{c.formattedAmount}</h4>
              </div>
            ))}
          </div>

          {/* Agency Summary Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-[#0F172A]">Seller Revenue & Payout Summary</h4>
                <p className="text-[11px] font-semibold text-slate-400">
                  Aggregated settlement performance per Travel Agency and Car Rental partner
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-50 text-[#583BE8]">
                {agencyBreakdown.length} Active Partners
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400">
                    <th className="py-3 px-4">Partner</th>
                    <th className="py-3 px-4 text-center">Bookings</th>
                    <th className="py-3 px-4 text-right">Total Volume</th>
                    <th className="py-3 px-4 text-right">Platform Fee Earned</th>
                    <th className="py-3 px-4 text-right">Pending Payouts</th>
                    <th className="py-3 px-4 text-right">Settled Payouts</th>
                    <th className="py-3 px-4 text-center">Failed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        <div className="w-5 h-5 border-2 border-[#583BE8] border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
                        Loading seller metrics...
                      </td>
                    </tr>
                  ) : agencyBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        No partner payout data available.
                      </td>
                    </tr>
                  ) : (
                    agencyBreakdown.map((row: any) => (
                      <tr key={row.agencyId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-black text-slate-900">{row.agencyName}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">{row.totalBookings}</td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          ₹{row.totalRevenue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-[#583BE8]">
                          ₹{row.platformCommissionEarned.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-amber-600">
                          ₹{row.pendingSettlements.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                          ₹{row.transferredSettlements.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {row.failedSettlements > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                              {row.failedSettlements}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">0</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: OPERATIONAL SLA & HEALTH MONITORING ─── */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* SLA Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Settlement SLA Compliance</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {monitoringData?.slaComplianceRate ?? '99.8'}%
              </div>
              <p className="text-[11px] text-slate-500 font-medium">T+2 settlement delivery within banking cutoff</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>In-Flight Route Transfers</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {monitoringData?.inFlightCount ?? 0}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Transfers initiated, awaiting settlement cycle</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Delayed Transfers (+SLA)</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600">
                {monitoringData?.delayedCount ?? 0}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Exceeded expected settlement timestamp</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Circuit Breaker State</span>
                <Activity className="w-4 h-4 text-[#583BE8]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-lg font-black text-slate-800">
                  {monitoringData?.circuitBreaker?.state ?? 'CLOSED (NORMAL)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Failure threshold: {monitoringData?.circuitBreaker?.failureCount ?? 0}/5
              </p>
            </div>
          </div>

          {/* Pending Payout Replacement Requests Review */}
          {monitoringData?.pendingReplacements && monitoringData.pendingReplacements.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#0F172A]">Seller Payout Account Replacement Requests</h4>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Sellers requesting to switch bank accounts after transactions have settled
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-800">
                  {monitoringData.pendingReplacements.length} Action Required
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400">
                      <th className="py-3 px-4">Seller</th>
                      <th className="py-3 px-4">Current Account</th>
                      <th className="py-3 px-4">New Requested Account</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {monitoringData.pendingReplacements.map((req: any) => (
                      <tr key={req.sellerId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900">{req.businessName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{req.sellerType}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {req.currentAccountMasked || '••••••••'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{req.newAccountMasked}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{req.newBankName} ({req.newIfsc})</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                          {req.reason}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApproveReplacement(req.sellerId)}
                              disabled={actionLoading === req.sellerId}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectReplacement(req.sellerId)}
                              disabled={actionLoading === req.sellerId}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: IMMUTABLE FINANCIAL AUDIT LEDGER ─── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-slate-100 shadow-2xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search audit trail by Booking, Settlement, UTR, or Notes..."
                value={auditSearch}
                onChange={(e) => {
                  setAuditSearch(e.target.value);
                  setAuditPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#583BE8]"
              />
            </div>
            <div className="text-xs font-bold text-slate-400 self-end sm:self-auto">
              Append-only audit trail • Never modified
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Source</th>
                    <th className="py-3 px-4">Booking / Reference</th>
                    <th className="py-3 px-4">State Transition</th>
                    <th className="py-3 px-4">UTR Reference</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Audit Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {auditLoading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        <div className="w-5 h-5 border-2 border-[#583BE8] border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
                        Loading immutable ledger records...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        No financial audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((ev: any) => (
                      <tr key={ev._id || ev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(ev.timestamp).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-700">
                            {ev.eventSource}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {ev.bookingId ? `#${ev.bookingId}` : ev.settlementReferenceId || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-400 font-medium">{ev.previousStatus}</span>
                          <span className="mx-1 text-slate-300">→</span>
                          <span className="text-emerald-700 font-black">{ev.newStatus}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                          {ev.utr || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {ev.amount ? `₹${ev.amount.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-[220px] truncate" title={ev.notes}>
                          {ev.notes}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {auditTotalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50/50">
                <span>Page {auditPage} of {auditTotalPages}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={auditPage <= 1}
                    onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={auditPage >= auditTotalPages}
                    onClick={() => setAuditPage((p) => p + 1)}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
