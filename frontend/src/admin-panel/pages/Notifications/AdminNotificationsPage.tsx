import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NotificationKPIStats,
  CampaignItem,
  NotificationAnalyticsData,
} from '../../types/notificationsManagement';
import { adminNotificationsManagementService } from '../../services/adminNotificationsManagement.service';
import {
  initialNotificationKPIStats,
  initialCampaignsData,
  initialNotificationAnalytics,
} from '../../data/notificationsData';
import { AdminNotificationsHeader } from '../../components/super-admin/notifications/AdminNotificationsHeader';
import { NotificationKPIStatsCards } from '../../components/super-admin/notifications/NotificationKPIStats';
import { CampaignLibrary } from '../../components/super-admin/notifications/CampaignLibrary';
import { CampaignBuilder } from '../../components/super-admin/notifications/CampaignBuilder';
import { NotificationDevicePreview } from '../../components/super-admin/notifications/NotificationDevicePreview';
import { NotificationBottomAnalytics } from '../../components/super-admin/notifications/NotificationBottomAnalytics';

export const AdminNotificationsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [kpiStats, setKpiStats] = useState<NotificationKPIStats>(initialNotificationKPIStats);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaignsData);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem>(
    initialCampaignsData.find((c) => c.id === 'CMP-105') || initialCampaignsData[0]
  );
  const [analytics, setAnalytics] = useState<NotificationAnalyticsData>(initialNotificationAnalytics);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadNotificationsData = useCallback(async () => {
    try {
      const [stats, campaignList, analyticsData] = await Promise.all([
        adminNotificationsManagementService.getKPIStats(),
        adminNotificationsManagementService.getCampaigns(statusFilter, searchQuery),
        adminNotificationsManagementService.getAnalytics(),
      ]);

      setKpiStats(stats);
      setCampaigns(campaignList);
      setAnalytics(analyticsData);

      if (campaignList.length > 0 && !campaignList.some((c: CampaignItem) => c.id === selectedCampaign?.id)) {
        setSelectedCampaign(campaignList[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load notifications management data', 'error');
    }
  }, [statusFilter, searchQuery, selectedCampaign]);

  useEffect(() => {
    loadNotificationsData();
  }, [loadNotificationsData]);

  // ── 3. CAMPAIGN BUILDER ACTIONS ──
  const handleCampaignChange = (updated: Partial<CampaignItem>) => {
    setSelectedCampaign((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleClearAll = () => {
    setSelectedCampaign((prev) => ({
      ...prev,
      title: '',
      name: 'Untitled Campaign',
      message: '',
      bannerImage: undefined,
      ctaText: 'Visit App',
      deepLink: '',
    }));
    showToast('Cleared campaign builder fields', 'info');
  };

  const handleSaveDraft = async () => {
    const saved = await adminNotificationsManagementService.saveCampaign({
      ...selectedCampaign,
      status: 'Draft',
    });
    setSelectedCampaign(saved);
    loadNotificationsData();
    showToast(`Campaign "${saved.title || saved.name}" saved as Draft`, 'success');
  };

  const handleSendNow = async () => {
    await adminNotificationsManagementService.sendCampaign(selectedCampaign.id);
    loadNotificationsData();
    showToast(`Campaign "${selectedCampaign.title}" is now broadcasting to ${selectedCampaign.audience}!`, 'success');
  };

  const handleCreateNewCampaign = () => {
    const newCamp: CampaignItem = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: 'New Announcement Campaign',
      type: 'Push',
      audience: 'All Users',
      audienceReach: '245,631',
      status: 'Draft',
      createdBy: 'You',
      createdAt: 'Just now',
      title: 'New Announcement Campaign 🚀',
      message: 'Write your message copy and guidelines here...',
      ctaText: 'Visit App',
      deepLink: '/home',
      timeZone: '(GMT +05:30) Asia/Kolkata',
    };
    setSelectedCampaign(newCamp);
    showToast('New campaign created in builder', 'info');
  };

  const handleUploadImageMock = () => {
    setSelectedCampaign((prev) => ({
      ...prev,
      bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    }));
    showToast('Media banner attached to notification preview', 'success');
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
      <AdminNotificationsHeader
        onOpenTemplates={() => showToast('Displaying 24 notification templates', 'info')}
        onOpenAudienceSegments={() => showToast('Opening audience segmentation manager', 'info')}
        onOpenHistory={() => showToast('Viewing complete notification dispatch logs', 'info')}
        onCreateCampaign={handleCreateNewCampaign}
      />

      {/* ── 2. 6 KPI SUMMARY CARDS ── */}
      <NotificationKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'scheduledCampaigns') setStatusFilter('Scheduled');
          else if (id === 'sentToday') setStatusFilter('Completed');
          else setStatusFilter('All');
        }}
      />

      {/* ── 3. MAIN 3-PANEL WORKSPACE (CAMPAIGN LIBRARY | BUILDER | PREVIEW) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Campaign Library (≈25% width / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <CampaignLibrary
            campaigns={campaigns}
            selectedCampaignId={selectedCampaign?.id}
            onSelectCampaign={(c) => setSelectedCampaign(c)}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLoadMore={() => showToast('Loaded additional campaign history', 'info')}
          />
        </div>

        {/* Center Panel: Campaign Builder (≈45% width / lg:col-span-5) */}
        <div className="lg:col-span-5">
          <CampaignBuilder
            campaign={selectedCampaign}
            onChange={handleCampaignChange}
            onClearAll={handleClearAll}
            onSaveDraft={handleSaveDraft}
            onSendNow={handleSendNow}
            onUploadImage={handleUploadImageMock}
          />
        </div>

        {/* Right Panel: Live Device Preview (≈30% width / lg:col-span-4) */}
        <div className="lg:col-span-4 sticky top-20">
          <NotificationDevicePreview
            campaign={selectedCampaign}
            onTestOnDevice={() => showToast('Test notification pushed to connected admin device', 'success')}
          />
        </div>
      </div>

      {/* ── 4. BOTTOM ANALYTICS ROW (FUNNEL, HEATMAP, SEGMENTATION, ACTIVITY) ── */}
      <NotificationBottomAnalytics
        analytics={analytics}
        onViewAllActivity={() => showToast('Opening full campaign audit log', 'info')}
      />
    </motion.div>
  );
};

export default AdminNotificationsPage;
