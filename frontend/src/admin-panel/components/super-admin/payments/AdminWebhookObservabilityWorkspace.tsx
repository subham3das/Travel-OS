import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Code2,
  Terminal,
  X,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { adminApiClient } from '../../../services/adminApiClient';

export const AdminWebhookObservabilityWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'logs' | 'dlq'>('logs');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Data states
  const [logs, setLogs] = useState<any[]>([]);
  const [dlqItems, setDlqItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });

  // Selected event for payload inspector modal
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedDlqIds, setSelectedDlqIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (subTab === 'logs') {
        const res = await adminApiClient.get<any>('/admin/webhooks/logs', {
          params: {
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            event: eventFilter || undefined,
            search: search.trim() || undefined,
            page: pagination.page,
            limit: pagination.limit,
          },
        });
        if (res.data?.success) {
          setLogs(res.data.data.logs || []);
          setPagination((p) => ({
            ...p,
            total: res.data.data.pagination.total,
            totalPages: res.data.data.pagination.totalPages,
          }));
        }
      } else {
        const res = await adminApiClient.get<any>('/admin/webhooks/dlq', {
          params: {
            search: search.trim() || undefined,
            page: pagination.page,
            limit: pagination.limit,
          },
        });
        if (res.data?.success) {
          setDlqItems(res.data.data.dlqItems || []);
          setPagination((p) => ({
            ...p,
            total: res.data.data.pagination.total,
            totalPages: res.data.data.pagination.totalPages,
          }));
        }
      }
    } catch (err: any) {
      console.warn('Failed to load webhook observability data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [subTab, statusFilter, eventFilter, search, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReplayEvent = async (eventId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/webhooks/replay/${eventId}`, {});
      showToast(`Webhook event ${eventId} re-queued for processing.`);
      fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to replay event', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchReplay = async () => {
    if (selectedDlqIds.length === 0) return;
    try {
      setIsProcessing(true);
      await adminApiClient.post('/admin/webhooks/dlq/replay-batch', {
        eventIds: selectedDlqIds,
      });
      showToast(`Successfully scheduled ${selectedDlqIds.length} DLQ events for replay.`);
      setSelectedDlqIds([]);
      fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Batch replay failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveDlq = async (eventId: string) => {
    try {
      setIsProcessing(true);
      await adminApiClient.post(`/admin/webhooks/dlq/${eventId}/resolve`, {
        notes: 'Manually inspected and marked resolved by Admin',
      });
      showToast('DLQ item marked resolved and archived.');
      fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to resolve DLQ item', 'error');
    } finally {
      setIsProcessing(false);
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

      {/* Observability Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Webhook Observability & Dead-Letter Queue (DLQ)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live ingest stream, idempotent idempotency log, and failure recovery queue for Razorpay Route events.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stream
          </button>
        </div>

        {/* Sub-Tabs: Live Logs vs DLQ */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSubTab('logs');
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                subTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Live Ingest Stream ({subTab === 'logs' ? pagination.total : 'All'})
            </button>
            <button
              onClick={() => {
                setSubTab('dlq');
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                subTab === 'dlq'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              Dead Letter Queue (DLQ)
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Event ID, Payload..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* DLQ Batch Actions */}
        {subTab === 'dlq' && selectedDlqIds.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
              {selectedDlqIds.length} dead-letter events selected
            </span>
            <button
              onClick={handleBatchReplay}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Batch Replay ({selectedDlqIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Table Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                {subTab === 'dlq' && (
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        dlqItems.length > 0 && selectedDlqIds.length === dlqItems.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDlqIds(dlqItems.map((i) => i.eventId));
                        } else {
                          setSelectedDlqIds([]);
                        }
                      }}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
                )}
                <th className="py-3 px-4">Event ID / Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Received At</th>
                <th className="py-3 px-4">Error / Retries</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={subTab === 'dlq' ? 7 : 6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Fetching webhook stream...
                  </td>
                </tr>
              ) : (subTab === 'logs' ? logs : dlqItems).length === 0 ? (
                <tr>
                  <td colSpan={subTab === 'dlq' ? 7 : 6} className="py-12 text-center text-slate-400 font-sans">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    {subTab === 'dlq' ? 'Dead Letter Queue is clear! Zero failed events.' : 'No webhook records found.'}
                  </td>
                </tr>
              ) : (
                (subTab === 'logs' ? logs : dlqItems).map((item) => (
                  <tr
                    key={item._id || item.eventId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {subTab === 'dlq' && (
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDlqIds.includes(item.eventId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDlqIds((ids) => [...ids, item.eventId]);
                            } else {
                              setSelectedDlqIds((ids) => ids.filter((id) => id !== item.eventId));
                            }
                          }}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                      </td>
                    )}
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                        {item.eventId}
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                        {item.event}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === 'PROCESSED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : item.status === 'DLQ' || item.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 animate-pulse'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {item.executionTimeMs ? `${item.executionTimeMs}ms` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {item.receivedAt ? new Date(item.receivedAt).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px]">
                      {item.errorMessage ? (
                        <span className="text-rose-500 font-sans" title={item.errorMessage}>
                          {item.errorMessage} (Attempt {item.retryCount || 1})
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEvent(item)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                        >
                          <Code2 className="w-3 h-3" /> Inspect
                        </button>
                        <button
                          onClick={() => handleReplayEvent(item.eventId)}
                          disabled={isProcessing}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Replay
                        </button>
                        {subTab === 'dlq' && (
                          <button
                            onClick={() => handleResolveDlq(item.eventId)}
                            disabled={isProcessing}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition-colors"
                          >
                            Resolve
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

      {/* Payload Inspector Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 font-mono text-xs flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-white flex items-center gap-2 font-sans">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Webhook Payload Inspector ({selectedEvent.eventId})
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 mt-4 space-y-4">
                <div>
                  <span className="text-slate-400 block mb-1 font-sans font-semibold">Event Metadata</span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Event: <span className="text-indigo-400">{selectedEvent.event}</span></div>
                    <div>Status: <span className="text-emerald-400">{selectedEvent.status}</span></div>
                    <div>Received: <span className="text-slate-400">{selectedEvent.receivedAt}</span></div>
                    <div>Execution Latency: <span className="text-amber-400">{selectedEvent.executionTimeMs}ms</span></div>
                    {selectedEvent.errorMessage && (
                      <div className="text-rose-400">Error: {selectedEvent.errorMessage}</div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 font-sans font-semibold">Raw Ingest Payload</span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                    {JSON.stringify(selectedEvent.payload || {}, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end font-sans">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
