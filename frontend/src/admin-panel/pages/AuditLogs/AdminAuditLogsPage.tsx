import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AuditLogKPIStats,
  AuditLogItem,
  EventCategoryCount,
  EventDistributionItem,
  TopActiveAdminItem,
  SecurityAlertItem,
} from '../../types/auditLogsManagement';
import {
  adminAuditLogsManagementService,
  AuditLogFilters,
} from '../../services/adminAuditLogsManagement.service';
import {
  initialAuditKPIStats,
  initialAuditLogsData,
  initialEventCategories,
  initialEventDistribution,
  initialLoginHeatmapMatrix,
  initialTopAdmins,
  initialSecurityAlerts,
} from '../../data/auditLogsData';
import { AdminAuditLogsHeader } from '../../components/super-admin/audit/AdminAuditLogsHeader';
import { AuditKPIStatsCards } from '../../components/super-admin/audit/AuditKPIStats';
import { EventExplorer } from '../../components/super-admin/audit/EventExplorer';
import { AuditTimeline } from '../../components/super-admin/audit/AuditTimeline';
import { EventInspectorSidebar } from '../../components/super-admin/audit/EventInspectorSidebar';
import { AuditBottomWidgets } from '../../components/super-admin/audit/AuditBottomWidgets';
import { AdvancedSearchModal } from '../../components/super-admin/audit/AdvancedSearchModal';

export const AdminAuditLogsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: '',
    severity: 'All Severities',
    module: 'All Modules',
    status: 'All Statuses',
  });
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Data States
  const [kpiStats, setKpiStats] = useState<AuditLogKPIStats>(initialAuditKPIStats);
  const [logs, setLogs] = useState<AuditLogItem[]>(initialAuditLogsData);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem>(initialAuditLogsData[0]);
  const [categories, setCategories] = useState<EventCategoryCount[]>(initialEventCategories);
  const [distribution, setDistribution] = useState<EventDistributionItem[]>(initialEventDistribution);
  const [heatmapMatrix, setHeatmapMatrix] = useState<number[][]>(initialLoginHeatmapMatrix);
  const [topAdmins, setTopAdmins] = useState<TopActiveAdminItem[]>(initialTopAdmins);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlertItem[]>(initialSecurityAlerts);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadAuditData = useCallback(async () => {
    try {
      const [
        stats,
        logsList,
        cats,
        dist,
        matrix,
        admins,
        alerts,
      ] = await Promise.all([
        adminAuditLogsManagementService.getKPIStats(),
        adminAuditLogsManagementService.getAuditLogs({
          ...filters,
          category: selectedCategory,
        }),
        adminAuditLogsManagementService.getCategories(),
        adminAuditLogsManagementService.getEventDistribution(),
        adminAuditLogsManagementService.getLoginHeatmap(),
        adminAuditLogsManagementService.getTopAdmins(),
        adminAuditLogsManagementService.getSecurityAlerts(),
      ]);

      setKpiStats(stats);
      setLogs(logsList);
      setCategories(cats);
      setDistribution(dist);
      setHeatmapMatrix(matrix);
      setTopAdmins(admins);
      setSecurityAlerts(alerts);

      if (logsList.length > 0 && !logsList.some((l) => l.id === selectedLog?.id)) {
        setSelectedLog(logsList[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load audit logs data', 'error');
    }
  }, [filters, selectedCategory, selectedLog]);

  useEffect(() => {
    loadAuditData();
  }, [loadAuditData]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleFilterChange = (updated: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      severity: 'All Severities',
      module: 'All Modules',
      status: 'All Statuses',
    });
    setSelectedCategory('All');
    showToast('Filters reset to default view', 'info');
  };

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,EventID,Timestamp,Module,EventType,Description,Actor,IPAddress,Severity,Status\n' +
      logs
        .map(
          (l) =>
            `${l.id},${l.date} ${l.timestamp},${l.module},${l.eventType},"${l.description}",${l.actor.name},${l.ipAddress},${l.severity},${l.status}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported audit logs to CSV successfully', 'success');
  };

  const handleExportSingleEvent = () => {
    if (!selectedLog) return;
    const jsonContent =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedLog, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `${selectedLog.id.toLowerCase()}_forensic_report.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selectedLog.id} details as JSON`, 'success');
  };

  const handleCopyEventId = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(selectedLog.id);
    showToast(`Copied "${selectedLog.id}" to clipboard`, 'success');
  };

  const handleFlagInvestigation = () => {
    if (!selectedLog) return;
    showToast(`Event ${selectedLog.id} flagged for security investigation`, 'info');
  };

  const handleInvestigateAlert = (alert: SecurityAlertItem) => {
    showToast(`Initiating forensic investigation for "${alert.title}"`, 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <AdminAuditLogsHeader
        isLiveActive={isLiveActive}
        onLiveLogsToggle={() => {
          setIsLiveActive(!isLiveActive);
          showToast(isLiveActive ? 'Live log stream paused' : 'Live log stream active', 'info');
        }}
        onExportLogs={handleExportLogs}
        onAdvancedSearch={() => setIsSearchModalOpen(true)}
      />

      {/* ── 2. 6 TOP KPI SUMMARY CARDS ── */}
      <AuditKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'criticalEvents') handleFilterChange({ severity: 'Critical' });
          else if (id === 'failedLogins') handleFilterChange({ module: 'Authentication' });
          else handleResetFilters();
        }}
      />

      {/* ── 3. MAIN 3-COLUMN SOC WORKSPACE (EXPLORER | TIMELINE | INSPECTOR) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Event Explorer (≈22% / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <EventExplorer
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              showToast(cat === 'All' ? 'Showing all categories' : `Filtering by ${cat}`, 'info');
            }}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Center Panel: Live Audit Timeline (≈53% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <AuditTimeline
            logs={logs}
            selectedLogId={selectedLog?.id}
            onSelectLog={(l) => {
              setSelectedLog(l);
              showToast(`Inspecting event ${l.id}`, 'info');
            }}
            onViewMoreMenu={(l) => {
              setSelectedLog(l);
              showToast(`Options opened for ${l.id}`, 'info');
            }}
          />
        </div>

        {/* Right Panel: Event Inspector (≈25% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <EventInspectorSidebar
            log={selectedLog}
            onExportEvent={handleExportSingleEvent}
            onCopyEventId={handleCopyEventId}
            onFlagInvestigation={handleFlagInvestigation}
            onViewRelatedLogs={() => showToast(`Finding linked events for ${selectedLog.actor.name}`, 'info')}
          />
        </div>
      </div>

      {/* ── 4. BOTTOM 4 MONITORING CARDS ── */}
      <AuditBottomWidgets
        distribution={distribution}
        heatmapMatrix={heatmapMatrix}
        topAdmins={topAdmins}
        securityAlerts={securityAlerts}
        onViewAllDistribution={() => showToast('Opening module event telemetry', 'info')}
        onViewFullHeatmap={() => showToast('Opening 30-day temporal login heatmap', 'info')}
        onViewAllAdmins={() => showToast('Opening administrative compliance leaderboard', 'info')}
        onViewAllAlerts={() => showToast('Opening threat detection center', 'info')}
        onInvestigateAlert={handleInvestigateAlert}
      />

      {/* ── 5. ADVANCED SEARCH MODAL ── */}
      <AdvancedSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onApplyFilters={(f) => {
          handleFilterChange(f);
          showToast('Forensic search parameters applied', 'success');
        }}
      />
    </motion.div>
  );
};

export default AdminAuditLogsPage;
