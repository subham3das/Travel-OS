import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommunityKPIStats,
  CommunityActivityDataPoint,
  EngagementFunnelStage,
  ContentTypeDistributionItem,
  TopActiveCommunityItem,
  ModerationCardItem,
  CommunityFeedRowItem,
  TrendingDestinationItem,
  CommunityHealthScoreData,
  TopCreatorItem,
  CommunityActivityEventItem,
  AnnouncementPayload,
} from '../../types/communityManagement';
import { adminCommunityManagementService } from '../../services/adminCommunityManagement.service';
import {
  initialCommunityKPIStats,
  initialActivityDaily,
  initialEngagementFunnel,
  initialContentTypeDistribution,
  initialTopActiveCommunities,
  initialTrendingDestinations,
  initialCommunityHealthScore,
  initialTopCreators,
  initialLiveActivityEvents,
} from '../../data/communityData';
import { AdminCommunityHeader } from '../../components/super-admin/community/AdminCommunityHeader';
import { CommunityKPIStatsCards } from '../../components/super-admin/community/CommunityKPIStats';
import { CommunityAnalyticsRow } from '../../components/super-admin/community/CommunityAnalyticsRow';
import { CommunityModerationQueue } from '../../components/super-admin/community/CommunityModerationQueue';
import { RecentCommunityFeedTable } from '../../components/super-admin/community/RecentCommunityFeedTable';
import { CommunityBottomWidgets } from '../../components/super-admin/community/CommunityBottomWidgets';
import { CommunityActivitySidebar } from '../../components/super-admin/community/CommunityActivitySidebar';
import { CreateAnnouncementModal } from '../../components/super-admin/community/CreateAnnouncementModal';
import { WarnUserModal } from '../../components/super-admin/community/WarnUserModal';

export const AdminCommunityPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timelineInterval, setTimelineInterval] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [moderationFilter, setModerationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [warningModalData, setWarningModalData] = useState<{ isOpen: boolean; authorName: string; itemId: string }>({
    isOpen: false,
    authorName: '',
    itemId: '',
  });

  // Data States
  const [kpiStats, setKpiStats] = useState<CommunityKPIStats>(initialCommunityKPIStats);
  const [activityTimeline, setActivityTimeline] = useState<CommunityActivityDataPoint[]>(initialActivityDaily);
  const [engagementFunnel, setEngagementFunnel] = useState<EngagementFunnelStage[]>(initialEngagementFunnel);
  const [contentDistribution, setContentDistribution] = useState<ContentTypeDistributionItem[]>(initialContentTypeDistribution);
  const [topCommunities, setTopCommunities] = useState<TopActiveCommunityItem[]>(initialTopActiveCommunities);
  const [moderationQueue, setModerationQueue] = useState<ModerationCardItem[]>([]);
  const [feedRows, setFeedRows] = useState<CommunityFeedRowItem[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<TrendingDestinationItem[]>(initialTrendingDestinations);
  const [healthScore, setHealthScore] = useState<CommunityHealthScoreData>(initialCommunityHealthScore);
  const [topCreators, setTopCreators] = useState<TopCreatorItem[]>(initialTopCreators);
  const [liveEvents, setLiveEvents] = useState<CommunityActivityEventItem[]>(initialLiveActivityEvents);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadCommunityData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        stats,
        timeline,
        funnel,
        distribution,
        communities,
        modQueue,
        feed,
        destinations,
        health,
        creators,
        events,
      ] = await Promise.all([
        adminCommunityManagementService.getKPIStats(),
        adminCommunityManagementService.getActivityTimeline(timelineInterval),
        adminCommunityManagementService.getEngagementFunnel(),
        adminCommunityManagementService.getContentTypeDistribution(),
        adminCommunityManagementService.getTopActiveCommunities(),
        adminCommunityManagementService.getModerationQueue(
          moderationFilter === 'Posts' || moderationFilter === 'Stories' || moderationFilter === 'Comments' || moderationFilter === 'Travel Circles'
            ? moderationFilter
            : 'All',
          moderationFilter === 'Reported' || moderationFilter === 'Pending Review'
            ? moderationFilter === 'Pending Review' ? 'Pending' : 'Reported'
            : 'All'
        ),
        adminCommunityManagementService.getRecentFeed(searchQuery),
        adminCommunityManagementService.getTrendingDestinations(),
        adminCommunityManagementService.getHealthScore(),
        adminCommunityManagementService.getTopCreators(),
        adminCommunityManagementService.getLiveActivity(),
      ]);

      setKpiStats(stats);
      setActivityTimeline(timeline);
      setEngagementFunnel(funnel);
      setContentDistribution(distribution);
      setTopCommunities(communities);
      setModerationQueue(modQueue);
      setFeedRows(feed);
      setTrendingDestinations(destinations);
      setHealthScore(health);
      setTopCreators(creators);
      setLiveEvents(events);
    } catch (err) {
      console.error(err);
      showToast('Failed to load community dashboard data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [timelineInterval, moderationFilter, searchQuery]);

  useEffect(() => {
    loadCommunityData();
  }, [loadCommunityData]);

  // ── 3. MODERATION ACTIONS ──
  const handleApprove = async (id: string) => {
    await adminCommunityManagementService.approveModerationItem(id);
    loadCommunityData();
    showToast(`Content ${id} Approved and published to community feed`, 'success');
  };

  const handleReject = async (id: string) => {
    await adminCommunityManagementService.rejectModerationItem(id);
    loadCommunityData();
    showToast(`Content ${id} Rejected`, 'error');
  };

  const handleRemove = async (id: string) => {
    await adminCommunityManagementService.removeModerationItem(id);
    loadCommunityData();
    showToast(`Content ${id} removed permanently from platform`, 'error');
  };

  const handleStar = async (id: string) => {
    await adminCommunityManagementService.toggleStarItem(id);
    loadCommunityData();
    showToast(`Content ${id} starred/featured in explore feed`, 'info');
  };

  const handleHide = async (id: string) => {
    await adminCommunityManagementService.toggleHideItem(id);
    loadCommunityData();
    showToast(`Content ${id} visibility updated`, 'info');
  };

  const handleOpenWarnModal = (authorName: string, id: string) => {
    setWarningModalData({ isOpen: true, authorName, itemId: id });
  };

  const handleConfirmWarn = async (reason: string) => {
    await adminCommunityManagementService.warnUser(warningModalData.authorName, warningModalData.itemId);
    loadCommunityData();
    showToast(`Formal policy strike issued to ${warningModalData.authorName}`, 'error');
  };

  const handleCreateAnnouncementSubmit = async (payload: AnnouncementPayload) => {
    await adminCommunityManagementService.createAnnouncement(payload);
    loadCommunityData();
    showToast(`Announcement "${payload.title}" broadcasted successfully!`, 'success');
  };

  // ── 4. EXPORT ──
  const handleExport = () => {
    const headers = ['Post ID', 'Creator', 'Category', 'Views', 'Likes', 'Comments', 'Shares', 'Reports', 'Status', 'Created'];
    const rows = feedRows.map((r) => [
      r.id,
      `"${r.creator.name}"`,
      `"${r.category}"`,
      r.views,
      r.likes,
      r.comments,
      r.shares,
      r.reports,
      r.status,
      `"${r.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_community_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Community moderation report exported to CSV', 'success');
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
      <AdminCommunityHeader
        onExport={handleExport}
        onRefresh={loadCommunityData}
        onCreateAnnouncement={() => setIsAnnouncementOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. 8 KPI SUMMARY CARDS ── */}
      <CommunityKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'reportedContent') setModerationFilter('Reported');
          else if (id === 'storiesToday') setModerationFilter('Stories');
          else if (id === 'totalPosts') setModerationFilter('Posts');
          else setModerationFilter('All');
        }}
      />

      {/* ── 3. COMMUNITY ANALYTICS ROW (TIMELINE + FUNNEL + DISTRIBUTION + ACTIVE COMMUNITIES) ── */}
      <CommunityAnalyticsRow
        activityTimeline={activityTimeline}
        engagementFunnel={engagementFunnel}
        contentDistribution={contentDistribution}
        topCommunities={topCommunities}
        interval={timelineInterval}
        onIntervalChange={setTimelineInterval}
        onViewAllCommunities={() => showToast('Displaying full community directory', 'info')}
      />

      {/* ── 4. HORIZONTAL MODERATION QUEUE WORKSPACE ── */}
      <CommunityModerationQueue
        items={moderationQueue}
        activeFilter={moderationFilter}
        onFilterChange={setModerationFilter}
        onApprove={handleApprove}
        onReject={handleReject}
        onRemove={handleRemove}
        onStar={handleStar}
        onHide={handleHide}
        onWarnUser={handleOpenWarnModal}
      />

      {/* ── 5. MAIN FEED TABLE + BOTTOM WIDGETS + STICKY RIGHT ACTIVITY SIDEBAR ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left 9 Columns: Recent Feed Table + 3 Bottom Analytics Cards */}
        <div className="xl:col-span-9 space-y-5">
          {/* Feed Table */}
          <RecentCommunityFeedTable
            feedRows={feedRows}
            onViewPost={(p) => showToast(`Opening post ${p.id}`, 'info')}
            onApprovePost={(p) => handleApprove(p.id)}
            onDeletePost={(p) => handleRemove(p.id)}
            onWarnUser={(p) => handleOpenWarnModal(p.creator.name, p.id)}
            onSuspendUser={(p) => showToast(`User ${p.creator.name} suspended from community`, 'error')}
          />

          {/* Bottom Analytics (Trending Destinations, Community Health Score 86, Top Creators) */}
          <CommunityBottomWidgets
            trendingDestinations={trendingDestinations}
            healthScore={healthScore}
            topCreators={topCreators}
            onViewAllCreators={() => showToast('Displaying full creator creator directory', 'info')}
          />
        </div>

        {/* Right 3 Columns: Sticky Community Activity Sidebar */}
        <div className="xl:col-span-3 sticky top-20">
          <CommunityActivitySidebar
            events={liveEvents}
            onViewAllActivity={() => showToast('Opening complete live event audit stream', 'info')}
          />
        </div>
      </div>

      {/* ── 6. CREATE ANNOUNCEMENT MODAL ── */}
      <CreateAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onPublish={handleCreateAnnouncementSubmit}
      />

      {/* ── 7. WARN USER MODAL ── */}
      <WarnUserModal
        isOpen={warningModalData.isOpen}
        authorName={warningModalData.authorName}
        itemId={warningModalData.itemId}
        onClose={() => setWarningModalData({ isOpen: false, authorName: '', itemId: '' })}
        onConfirm={handleConfirmWarn}
      />
    </motion.div>
  );
};

export default AdminCommunityPage;
