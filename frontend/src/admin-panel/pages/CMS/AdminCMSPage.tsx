import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CMSKPIStats,
  CMSContentTreeItem,
  CMSSectionItem,
  CMSHeroBannerData,
  CMSScheduledTimelineItem,
  CMSContentActivityItem,
  CMSVersionHistoryItem,
  CMSMediaUsageItem,
} from '../../types/cmsManagement';
import { adminCMSManagementService } from '../../services/adminCMSManagement.service';
import {
  initialCMSKPIStats,
  initialContentTree,
  initialHeroBanner,
  initialCMSSections,
  initialScheduledTimeline,
  initialContentActivity,
  initialVersionHistory,
  initialMediaUsage,
} from '../../data/cmsData';
import { AdminCMSHeader } from '../../components/super-admin/cms/AdminCMSHeader';
import { CMSKPIStatsCards } from '../../components/super-admin/cms/CMSKPIStats';
import { ContentExplorer } from '../../components/super-admin/cms/ContentExplorer';
import { VisualContentBuilder } from '../../components/super-admin/cms/VisualContentBuilder';
import { CMSLiveDevicePreview } from '../../components/super-admin/cms/CMSLiveDevicePreview';
import { CMSBottomWidgets } from '../../components/super-admin/cms/CMSBottomWidgets';
import { CreateContentModal } from '../../components/super-admin/cms/CreateContentModal';

export const AdminCMSPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('homepage');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Data States
  const [kpiStats, setKpiStats] = useState<CMSKPIStats>(initialCMSKPIStats);
  const [contentTree, setContentTree] = useState<CMSContentTreeItem[]>(initialContentTree);
  const [heroBanner, setHeroBanner] = useState<CMSHeroBannerData>(initialHeroBanner);
  const [sections, setSections] = useState<CMSSectionItem[]>(initialCMSSections);
  const [scheduledTimeline, setScheduledTimeline] = useState<CMSScheduledTimelineItem[]>(initialScheduledTimeline);
  const [activity, setActivity] = useState<CMSContentActivityItem[]>(initialContentActivity);
  const [versionHistory, setVersionHistory] = useState<CMSVersionHistoryItem[]>(initialVersionHistory);
  const [mediaUsage, setMediaUsage] = useState<CMSMediaUsageItem[]>(initialMediaUsage);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadCMSData = useCallback(async () => {
    try {
      const [
        stats,
        tree,
        banner,
        secs,
        timeline,
        acts,
        versions,
        media,
      ] = await Promise.all([
        adminCMSManagementService.getKPIStats(),
        adminCMSManagementService.getContentTree(searchQuery),
        adminCMSManagementService.getHeroBanner(),
        adminCMSManagementService.getSections(),
        adminCMSManagementService.getScheduledTimeline(),
        adminCMSManagementService.getActivity(),
        adminCMSManagementService.getVersionHistory(),
        adminCMSManagementService.getMediaUsage(),
      ]);

      setKpiStats(stats);
      setContentTree(tree);
      setHeroBanner(banner);
      setSections(secs);
      setScheduledTimeline(timeline);
      setActivity(acts);
      setVersionHistory(versions);
      setMediaUsage(media);
    } catch (err) {
      console.error(err);
      showToast('Failed to load CMS management data', 'error');
    }
  }, [searchQuery]);

  useEffect(() => {
    loadCMSData();
  }, [loadCMSData]);

  // ── 3. VISUAL BUILDER ACTIONS ──
  const handleHeroBannerChange = (updated: Partial<CMSHeroBannerData>) => {
    setHeroBanner((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleToggleSection = async (id: string) => {
    const updated = await adminCMSManagementService.toggleSection(id);
    setSections(updated);
    showToast('Updated section visibility', 'info');
  };

  const handleSaveDraft = async () => {
    await adminCMSManagementService.updateHeroBanner(heroBanner);
    showToast('Draft version saved successfully', 'success');
  };

  const handlePublish = async () => {
    await adminCMSManagementService.updateHeroBanner(heroBanner);
    showToast('Changes published live to Travel OS platform!', 'success');
  };

  const handleChangeImageMock = () => {
    const newImage =
      heroBanner.imageUrl.includes('506744038136')
        ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop';

    setHeroBanner((prev) => ({ ...prev, imageUrl: newImage }));
    showToast('Hero banner image updated in live preview', 'success');
  };

  const handleCreateContent = (title: string, type: string) => {
    showToast(`Created new ${type}: "${title}" in content explorer`, 'success');
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
      <AdminCMSHeader
        onPreviewSite={() => showToast('Opening live website preview in staging environment', 'info')}
        onContentHistory={() => showToast('Displaying global content revision audit log', 'info')}
        onSEOAnalyzer={() => showToast('SEO Score: 94/100 (Optimal Keywords & Metadata)', 'success')}
        onCreateContent={() => setIsCreateModalOpen(true)}
      />

      {/* ── 2. 6 TOP KPI SUMMARY CARDS ── */}
      <CMSKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'publishedPages') setSelectedItemId('homepage');
          else if (id === 'totalMediaFiles') setSelectedItemId('media');
          else setSelectedItemId('homepage');
        }}
      />

      {/* ── 3. MAIN 3-PANEL CMS WORKSPACE (EXPLORER | BUILDER | PREVIEW) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Content Explorer (≈22% / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <ContentExplorer
            tree={contentTree}
            selectedItemId={selectedItemId}
            onSelectItem={(node) => {
              setSelectedItemId(node.id);
              showToast(`Loaded ${node.label} into visual editor`, 'info');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateContent={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Center Panel: Visual Content Builder (≈53% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <VisualContentBuilder
            heroBanner={heroBanner}
            sections={sections}
            onHeroBannerChange={handleHeroBannerChange}
            onToggleSection={handleToggleSection}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            onChangeImage={handleChangeImageMock}
            onAddNewSection={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Right Panel: Live Device Preview (≈25% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <CMSLiveDevicePreview heroBanner={heroBanner} />
        </div>
      </div>

      {/* ── 4. BOTTOM 4 WIDGETS (TIMELINE, ACTIVITY, VERSION HISTORY, MEDIA DONUT) ── */}
      <CMSBottomWidgets
        scheduledTimeline={scheduledTimeline}
        recentActivity={activity}
        versionHistory={versionHistory}
        mediaUsage={mediaUsage}
        onViewAllTimeline={() => showToast('Displaying scheduled publications calendar', 'info')}
        onViewAllActivity={() => showToast('Opening collaborative real-time activity stream', 'info')}
        onViewAllVersions={() => showToast('Displaying full revision rollback log', 'info')}
        onViewAllMedia={() => showToast('Navigating to media asset manager', 'info')}
      />

      {/* ── 5. CREATE CONTENT MODAL ── */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateContent}
      />
    </motion.div>
  );
};

export default AdminCMSPage;
