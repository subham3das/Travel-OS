import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SettingsKPIStats,
  GeneralSettingsData,
  FeatureFlagItem,
  SystemStatusMetric,
  ConnectedServiceItem,
  SettingsRecentChangeItem,
  IntegrationHealthItem,
  BackupTimelineItem,
  FeatureUsageItem,
  ApiUsagePoint,
  SettingsCategoryType,
} from '../../types/settingsManagement';
import { adminSettingsManagementService } from '../../services/adminSettingsManagement.service';
import {
  initialSettingsKPIStats,
  initialGeneralSettings,
  initialFeatureFlags,
  initialSystemStatusMetrics,
  initialConnectedServices,
  initialSettingsRecentChanges,
  initialIntegrationHealth,
  initialApiUsagePoints,
  initialBackupTimeline,
  initialFeatureUsage,
} from '../../data/settingsData';
import { AdminSettingsHeader } from '../../components/super-admin/settings/AdminSettingsHeader';
import { SettingsKPIStatsCards } from '../../components/super-admin/settings/SettingsKPIStats';
import { SettingsNavigation } from '../../components/super-admin/settings/SettingsNavigation';
import { DynamicSettingsWorkspace } from '../../components/super-admin/settings/DynamicSettingsWorkspace';
import { SystemStatusSidebar } from '../../components/super-admin/settings/SystemStatusSidebar';
import { SettingsBottomWidgets } from '../../components/super-admin/settings/SettingsBottomWidgets';
import { ConfirmActionModal } from '../../components/super-admin/settings/ConfirmActionModal';

export const AdminSettingsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryType>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
    isDanger: false,
  });

  // Data States
  const [kpiStats, setKpiStats] = useState<SettingsKPIStats>(initialSettingsKPIStats);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsData>(initialGeneralSettings);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>(initialFeatureFlags);
  const [systemMetrics, setSystemMetrics] = useState<SystemStatusMetric[]>(initialSystemStatusMetrics);
  const [services, setServices] = useState<ConnectedServiceItem[]>(initialConnectedServices);
  const [recentChanges, setRecentChanges] = useState<SettingsRecentChangeItem[]>(initialSettingsRecentChanges);
  const [integrationHealth, setIntegrationHealth] = useState<IntegrationHealthItem[]>(initialIntegrationHealth);
  const [apiUsage, setApiUsage] = useState<ApiUsagePoint[]>(initialApiUsagePoints);
  const [backupTimeline, setBackupTimeline] = useState<BackupTimelineItem[]>(initialBackupTimeline);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsageItem[]>(initialFeatureUsage);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadSettingsData = useCallback(async () => {
    try {
      const [
        stats,
        general,
        features,
        metrics,
        srvList,
        changes,
        health,
        usage,
        backups,
        featUsage,
      ] = await Promise.all([
        adminSettingsManagementService.getKPIStats(),
        adminSettingsManagementService.getGeneralSettings(),
        adminSettingsManagementService.getFeatureFlags(),
        adminSettingsManagementService.getSystemMetrics(),
        adminSettingsManagementService.getConnectedServices(),
        adminSettingsManagementService.getRecentChanges(),
        adminSettingsManagementService.getIntegrationHealth(),
        adminSettingsManagementService.getApiUsage(),
        adminSettingsManagementService.getBackupTimeline(),
        adminSettingsManagementService.getFeatureUsage(),
      ]);

      setKpiStats(stats);
      setGeneralSettings(general);
      setFeatureFlags(features);
      setSystemMetrics(metrics);
      setServices(srvList);
      setRecentChanges(changes);
      setIntegrationHealth(health);
      setApiUsage(usage);
      setBackupTimeline(backups);
      setFeatureUsage(featUsage);
    } catch (err) {
      console.error(err);
      showToast('Failed to load platform settings data', 'error');
    }
  }, []);

  useEffect(() => {
    loadSettingsData();
  }, [loadSettingsData]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleUpdateGeneral = (data: Partial<GeneralSettingsData>) => {
    setGeneralSettings((prev) => ({ ...prev, ...data }));
  };

  const handleToggleFeature = async (id: string, enabled: boolean) => {
    const updated = await adminSettingsManagementService.toggleFeatureFlag(id, enabled);
    setFeatureFlags(updated);
    const feat = updated.find((f) => f.id === id);
    showToast(`${feat?.name || 'Feature'} ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await adminSettingsManagementService.updateGeneralSettings(generalSettings);
    setTimeout(() => {
      setIsSaving(false);
      showToast('All platform settings saved and propagated successfully', 'success');
    }, 400);
  };

  const handleResetToDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Default Settings',
      message:
        'Are you sure you want to revert all global configurations and feature flags to system default values? This action cannot be undone.',
      confirmLabel: 'Revert to Defaults',
      isDanger: true,
      onConfirm: async () => {
        const reset = await adminSettingsManagementService.resetToDefaults();
        setGeneralSettings(reset);
        setFeatureFlags(initialFeatureFlags);
        showToast('Settings reverted to system default configuration', 'info');
      },
    });
  };

  const handleLogoUpload = () => {
    showToast('Platform logo uploaded and updated across client apps', 'success');
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
      <AdminSettingsHeader
        onSaveAll={handleSaveAll}
        onResetDefault={handleResetToDefaults}
        isSaving={isSaving}
      />

      {/* ── 2. 6 TOP KPI SUMMARY CARDS ── */}
      <SettingsKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'activeIntegrations') setActiveCategory('integrations');
          else if (id === 'storageUsage') setActiveCategory('storage');
          else if (id === 'lastBackup') setActiveCategory('backups');
          else setActiveCategory('general');
        }}
      />

      {/* ── 3. MAIN 3-COLUMN WORKSPACE (NAV | WORKSPACE | STATUS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Settings Navigation (≈22% / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <SettingsNavigation
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              showToast(`Navigated to ${cat} settings`, 'info');
            }}
          />
        </div>

        {/* Center Panel: Dynamic Settings Workspace (≈53% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <DynamicSettingsWorkspace
            category={activeCategory}
            generalSettings={generalSettings}
            featureFlags={featureFlags}
            onUpdateGeneral={handleUpdateGeneral}
            onToggleFeature={handleToggleFeature}
            onLogoUpload={handleLogoUpload}
          />
        </div>

        {/* Right Panel: System Status (≈25% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <SystemStatusSidebar
            metrics={systemMetrics}
            services={services}
            recentChanges={recentChanges}
            onViewMetrics={() => showToast('Opening system telemetry metrics dashboard', 'info')}
            onViewAllChanges={() => showToast('Displaying full configuration change audit history', 'info')}
          />
        </div>
      </div>

      {/* ── 4. BOTTOM 4 OPERATIONAL WIDGETS ── */}
      <SettingsBottomWidgets
        integrationHealth={integrationHealth}
        apiUsage={apiUsage}
        backupTimeline={backupTimeline}
        featureUsage={featureUsage}
        onViewAllIntegrations={() => showToast('Opening integration telemetry monitor', 'info')}
        onViewAllApiUsage={() => showToast('Opening API gateway usage reports', 'info')}
        onViewAllBackups={() => showToast('Opening automated snapshot archives', 'info')}
        onViewAllFeatures={() => showToast('Opening platform feature telemetry matrix', 'info')}
      />

      {/* ── 5. CONFIRMATION MODAL ── */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </motion.div>
  );
};

export default AdminSettingsPage;
