import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  NotificationCenterKPISummary,
  NotificationFeedItem,
  SmartGroupItem,
  SavedFilterItem,
  PinnedNotificationItem,
  AISummaryData,
  NotificationPreferencesData,
  NotificationBottomWidgetsData,
  NotificationCategoryType,
} from '../../types/advancedNotificationCenter';
import { advancedNotificationCenterService } from '../../services/advancedNotificationCenter.service';
import {
  initialNotificationCenterKPIs,
  initialSmartGroups,
  initialSavedFilters,
  initialPinnedNotifications,
  initialAISummary,
  initialNotificationPreferences,
  initialBottomWidgetsData,
} from '../../data/advancedNotificationCenterData';
import { NotificationCenterHeader } from '../../components/super-admin/notifications/NotificationCenterHeader';
import { NotificationCenterKPIs } from '../../components/super-admin/notifications/NotificationCenterKPIs';
import { NotificationCenterFiltersBar } from '../../components/super-admin/notifications/NotificationCenterFiltersBar';
import { NotificationSmartGroupsSidebar } from '../../components/super-admin/notifications/NotificationSmartGroupsSidebar';
import { NotificationFeedSection } from '../../components/super-admin/notifications/NotificationFeedSection';
import { NotificationInsightsRightSidebar } from '../../components/super-admin/notifications/NotificationInsightsRightSidebar';
import { NotificationCenterBottomWidgets } from '../../components/super-admin/notifications/NotificationCenterBottomWidgets';
import { NewNotificationModal } from '../../components/super-admin/notifications/NewNotificationModal';
import { NotificationRulesModal } from '../../components/super-admin/notifications/NotificationRulesModal';
import { AISummaryModal } from '../../components/super-admin/notifications/AISummaryModal';

export const AdminNotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  // ── 1. FILTER & SEARCH STATES ──
  const [activeCategory, setActiveCategory] = useState<NotificationCategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [selectedFilterId, setSelectedFilterId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // ── 2. DATA STATES ──
  const [kpis, setKpis] = useState<NotificationCenterKPISummary>(initialNotificationCenterKPIs);
  const [feedItems, setFeedItems] = useState<NotificationFeedItem[]>([]);
  const [smartGroups, setSmartGroups] = useState<SmartGroupItem[]>(initialSmartGroups);
  const [savedFilters, setSavedFilters] = useState<SavedFilterItem[]>(initialSavedFilters);
  const [pinned, setPinned] = useState<PinnedNotificationItem[]>(initialPinnedNotifications);
  const [aiSummary, setAiSummary] = useState<AISummaryData>(initialAISummary);
  const [preferences, setPreferences] = useState<NotificationPreferencesData>(
    initialNotificationPreferences
  );
  const [bottomWidgets, setBottomWidgets] =
    useState<NotificationBottomWidgetsData>(initialBottomWidgetsData);

  // Selection state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isAISummaryModalOpen, setIsAISummaryModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 3. DATA FETCHING ──
  const loadData = useCallback(async () => {
    try {
      const [kpiData, groups, filters, pinnedData, summary, prefs, widgets, items] =
        await Promise.all([
          advancedNotificationCenterService.getKPIs(),
          advancedNotificationCenterService.getSmartGroups(),
          advancedNotificationCenterService.getSavedFilters(),
          advancedNotificationCenterService.getPinnedNotifications(),
          advancedNotificationCenterService.getAISummary(),
          advancedNotificationCenterService.getPreferences(),
          advancedNotificationCenterService.getBottomWidgets(),
          advancedNotificationCenterService.getFeedItems(
            activeCategory,
            searchQuery,
            selectedGroupId,
            selectedFilterId
          ),
        ]);

      setKpis(kpiData);
      setSmartGroups(groups);
      setSavedFilters(filters);
      setPinned(pinnedData);
      setAiSummary(summary);
      setPreferences(prefs);
      setBottomWidgets(widgets);
      setFeedItems(items);
    } catch (err) {
      console.error(err);
      showToast('Failed to load notification center data', 'error');
    }
  }, [activeCategory, searchQuery, selectedGroupId, selectedFilterId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── 4. HANDLERS ──
  const handleSelectCategory = (cat: NotificationCategoryType) => {
    setActiveCategory(cat);
    setSelectedGroupId(undefined);
    setSelectedFilterId(undefined);
    setSelectedItemIds([]);
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId((prev) => (prev === groupId ? undefined : groupId));
    setSelectedFilterId(undefined);
    setSelectedItemIds([]);
  };

  const handleSelectFilter = (filterId: string) => {
    setSelectedFilterId((prev) => (prev === filterId ? undefined : filterId));
    setSelectedGroupId(undefined);
    setSelectedItemIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === feedItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(feedItems.map((i) => i.id));
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedItemIds.length === 0) return;
    await advancedNotificationCenterService.bulkMarkAsRead(selectedItemIds);
    showToast(`Marked ${selectedItemIds.length} notifications as read`);
    setSelectedItemIds([]);
    loadData();
  };

  const handleBulkArchive = async () => {
    if (selectedItemIds.length === 0) return;
    await advancedNotificationCenterService.bulkArchive(selectedItemIds);
    showToast(`Archived ${selectedItemIds.length} notifications`);
    setSelectedItemIds([]);
    loadData();
  };

  const handleBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    await advancedNotificationCenterService.bulkDelete(selectedItemIds);
    showToast(`Deleted ${selectedItemIds.length} notifications`);
    setSelectedItemIds([]);
    loadData();
  };

  const handleExecuteAction = async (id: string, actionType: string) => {
    const res = await advancedNotificationCenterService.executeInlineAction(id, actionType);
    showToast(res.message, res.success ? 'success' : 'error');
    loadData();
  };

  const handleViewItem = (item: NotificationFeedItem) => {
    advancedNotificationCenterService.markAsRead(item.id);
    if (item.targetRoute) {
      navigate(item.targetRoute);
    }
  };

  const handleCreateNotification = async (data: {
    category: NotificationCategoryType;
    title: string;
    description: string;
    metadata: string;
    priority: NotificationFeedItem['priority'];
    targetRoute: string;
  }) => {
    await advancedNotificationCenterService.createNotification(data);
    showToast('Platform notification broadcasted successfully');
    loadData();
  };

  const handleUpdatePreferences = async (
    partial: Partial<NotificationPreferencesData>
  ) => {
    const updated = await advancedNotificationCenterService.updatePreferences(partial);
    setPreferences(updated);
    showToast('Preferences updated');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* ── Floating Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-[1300] shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black shadow-lg ${
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
      <NotificationCenterHeader
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSettings={() => navigate('/admin/settings')}
        onOpenNewNotification={() => setIsNewModalOpen(true)}
      />

      {/* ── 2. TOP KPI SUMMARY CARDS ── */}
      <NotificationCenterKPIs
        kpis={kpis}
        onFilterUnread={() => handleSelectCategory('unread')}
        onFilterCritical={() => handleSelectCategory('critical')}
        onFilterActionRequired={() => handleSelectCategory('critical')}
      />

      {/* ── 3. CATEGORY FILTERS & SEARCH BAR ── */}
      <NotificationCenterFiltersBar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdvancedFilters={() => showToast('Filters drawer applied', 'info')}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* ── 4. PRIMARY 3-COLUMN WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (≈22% / lg:col-span-3) - Smart Groups & Saved Filters */}
        <div className="lg:col-span-3">
          <NotificationSmartGroupsSidebar
            smartGroups={smartGroups}
            savedFilters={savedFilters}
            selectedGroupId={selectedGroupId}
            selectedFilterId={selectedFilterId}
            onSelectGroup={handleSelectGroup}
            onSelectFilter={handleSelectFilter}
            onManageFilters={() => showToast('Manage saved filters', 'info')}
          />
        </div>

        {/* Center Column (≈52% / lg:col-span-6) - Notification Feed */}
        <div className="lg:col-span-6">
          <NotificationFeedSection
            items={feedItems}
            selectedItemIds={selectedItemIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onBulkMarkRead={handleBulkMarkRead}
            onBulkArchive={handleBulkArchive}
            onBulkDelete={handleBulkDelete}
            onExecuteAction={handleExecuteAction}
            onViewItem={handleViewItem}
          />
        </div>

        {/* Right Column (≈26% / lg:col-span-3) - Pinned, AI Summary & Preferences */}
        <div className="lg:col-span-3">
          <NotificationInsightsRightSidebar
            pinned={pinned}
            aiSummary={aiSummary}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onOpenAISummaryModal={() => setIsAISummaryModalOpen(true)}
            onSelectPinned={(p) => navigate(p.targetRoute)}
          />
        </div>
      </div>

      {/* ── 5. BOTTOM OPERATIONAL MONITORING WIDGETS ── */}
      <NotificationCenterBottomWidgets
        data={bottomWidgets}
        onRetryDelivery={(channel) =>
          showToast(`Retrying failed notifications for ${channel}...`, 'info')
        }
      />

      {/* ── MODALS ── */}
      <NewNotificationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateNotification}
      />

      <NotificationRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onSave={() => showToast('Notification routing rules saved', 'success')}
      />

      <AISummaryModal
        isOpen={isAISummaryModalOpen}
        onClose={() => setIsAISummaryModalOpen(false)}
        summary={aiSummary}
      />
    </div>
  );
};

export default AdminNotificationsPage;
