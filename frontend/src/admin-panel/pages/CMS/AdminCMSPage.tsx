import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CMSCategoryTab,
  HeroBannerItem,
  PlatformAnnouncementItem,
  TrendingDestinationItem,
  FeaturedAgencyItem,
  FeaturedTripItem,
  PromotionalCampaignItem,
  PromoPopupItem,
  HomepageSectionItem,
  HomepageSEOData,
  CMSKPIStats as CMSKPIStatsType,
  CMSScheduledItem,
  CMSRecentChangeItem,
} from '../../types/cmsManagement';
import { adminCMSManagementService } from '../../services/adminCMSManagement.service';
import {
  initialHeroBanners,
  initialAnnouncements,
  initialTrendingDestinations,
  initialFeaturedAgencies,
  initialFeaturedTrips,
  initialPromotionalCampaigns,
  initialPromoPopups,
  initialHomepageSections,
  initialSEOData,
  initialCMSKPIStats,
  initialCMSScheduledItems,
  initialCMSRecentChanges,
} from '../../data/cmsData';

import { AdminCMSHeader } from '../../components/super-admin/cms/AdminCMSHeader';
import { CMSKPIStats } from '../../components/super-admin/cms/CMSKPIStats';
import { CMSCategorySidebar } from '../../components/super-admin/cms/CMSCategorySidebar';

import { HeroBannerEditor } from '../../components/super-admin/cms/editors/HeroBannerEditor';
import { AnnouncementManager } from '../../components/super-admin/cms/editors/AnnouncementManager';
import { TrendingDestinationsEditor } from '../../components/super-admin/cms/editors/TrendingDestinationsEditor';
import { FeaturedAgenciesEditor } from '../../components/super-admin/cms/editors/FeaturedAgenciesEditor';
import { FeaturedTripsEditor } from '../../components/super-admin/cms/editors/FeaturedTripsEditor';
import { PromotionalCampaignsEditor } from '../../components/super-admin/cms/editors/PromotionalCampaignsEditor';
import { PopupManagerEditor } from '../../components/super-admin/cms/editors/PopupManagerEditor';
import { HomepageSectionsEditor } from '../../components/super-admin/cms/editors/HomepageSectionsEditor';
import { SEOEditor } from '../../components/super-admin/cms/editors/SEOEditor';

import { CMSLiveStorefrontPreview } from '../../components/super-admin/cms/CMSLiveStorefrontPreview';
import { CMSBottomDashboard } from '../../components/super-admin/cms/CMSBottomDashboard';

import { NewBannerModal } from '../../components/super-admin/cms/modals/NewBannerModal';
import { NewAnnouncementModal } from '../../components/super-admin/cms/modals/NewAnnouncementModal';
import { NewCampaignModal } from '../../components/super-admin/cms/modals/NewCampaignModal';
import { NewPopupModal } from '../../components/super-admin/cms/modals/NewPopupModal';

export const AdminCMSPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [activeTab, setActiveTab] = useState<CMSCategoryTab>('banners');

  // Modals
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);

  // Content Data
  const [kpiStats, setKpiStats] = useState<CMSKPIStatsType>(initialCMSKPIStats);
  const [banners, setBanners] = useState<HeroBannerItem[]>(initialHeroBanners);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncementItem[]>(initialAnnouncements);
  const [destinations, setDestinations] = useState<TrendingDestinationItem[]>(initialTrendingDestinations);
  const [agencies, setAgencies] = useState<FeaturedAgencyItem[]>(initialFeaturedAgencies);
  const [trips, setTrips] = useState<FeaturedTripItem[]>(initialFeaturedTrips);
  const [campaigns, setCampaigns] = useState<PromotionalCampaignItem[]>(initialPromotionalCampaigns);
  const [popups, setPopups] = useState<PromoPopupItem[]>(initialPromoPopups);
  const [sections, setSections] = useState<HomepageSectionItem[]>(initialHomepageSections);
  const [seo, setSeo] = useState<HomepageSEOData>(initialSEOData);
  const [scheduledItems, setScheduledItems] = useState<CMSScheduledItem[]>(initialCMSScheduledItems);
  const [recentChanges, setRecentChanges] = useState<CMSRecentChangeItem[]>(initialCMSRecentChanges);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadData = useCallback(async () => {
    try {
      const [
        stats,
        bans,
        anns,
        dests,
        ags,
        trps,
        camps,
        pops,
        secs,
        seoData,
        sched,
        changes,
      ] = await Promise.all([
        adminCMSManagementService.getKPIStats(),
        adminCMSManagementService.getBanners(),
        adminCMSManagementService.getAnnouncements(),
        adminCMSManagementService.getDestinations(),
        adminCMSManagementService.getFeaturedAgencies(),
        adminCMSManagementService.getFeaturedTrips(),
        adminCMSManagementService.getCampaigns(),
        adminCMSManagementService.getPopups(),
        adminCMSManagementService.getSections(),
        adminCMSManagementService.getSEO(),
        adminCMSManagementService.getScheduledItems(),
        adminCMSManagementService.getRecentChanges(),
      ]);

      setKpiStats(stats);
      setBanners(bans);
      setAnnouncements(anns);
      setDestinations(dests);
      setAgencies(ags);
      setTrips(trps);
      setCampaigns(camps);
      setPopups(pops);
      setSections(secs);
      setSeo(seoData);
      setScheduledItems(sched);
      setRecentChanges(changes);
    } catch (err) {
      console.error(err);
      showToast('Failed to load CMS content', 'error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── 3. HANDLERS ──
  const handleSaveBanner = async (b: Partial<HeroBannerItem>) => {
    await adminCMSManagementService.saveBanner(b);
    showToast('Hero Banner saved and published to storefront', 'success');
    loadData();
  };

  const handleDeleteBanner = async (id: string) => {
    await adminCMSManagementService.deleteBanner(id);
    showToast('Hero Banner deleted', 'info');
    loadData();
  };

  const handleSaveAnnouncement = async (ann: Partial<PlatformAnnouncementItem>) => {
    await adminCMSManagementService.saveAnnouncement(ann);
    showToast('Platform Announcement broadcasted successfully', 'success');
    loadData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await adminCMSManagementService.deleteAnnouncement(id);
    showToast('Announcement removed', 'info');
    loadData();
  };

  const handleSaveDestination = async (dest: Partial<TrendingDestinationItem>) => {
    await adminCMSManagementService.saveDestination(dest);
    showToast('Trending Destination updated', 'success');
    loadData();
  };

  const handleDeleteDestination = async (id: string) => {
    await adminCMSManagementService.deleteDestination(id);
    showToast('Destination removed', 'info');
    loadData();
  };

  const handleSaveAgency = async (agency: Partial<FeaturedAgencyItem>) => {
    await adminCMSManagementService.saveFeaturedAgency(agency);
    showToast('Featured Agency showcase updated', 'success');
    loadData();
  };

  const handleDeleteAgency = async (id: string) => {
    await adminCMSManagementService.deleteFeaturedAgency(id);
    showToast('Agency removed from featured showcase', 'info');
    loadData();
  };

  const handleSaveTrip = async (trip: Partial<FeaturedTripItem>) => {
    await adminCMSManagementService.saveFeaturedTrip(trip);
    showToast('Featured Trip package updated', 'success');
    loadData();
  };

  const handleDeleteTrip = async (id: string) => {
    await adminCMSManagementService.deleteFeaturedTrip(id);
    showToast('Trip package removed', 'info');
    loadData();
  };

  const handleSaveCampaign = async (camp: Partial<PromotionalCampaignItem>) => {
    await adminCMSManagementService.saveCampaign(camp);
    showToast('Promotional Campaign launched', 'success');
    loadData();
  };

  const handleDeleteCampaign = async (id: string) => {
    await adminCMSManagementService.deleteCampaign(id);
    showToast('Campaign deleted', 'info');
    loadData();
  };

  const handleSavePopup = async (pop: Partial<PromoPopupItem>) => {
    await adminCMSManagementService.savePopup(pop);
    showToast('Storefront Promo Popup saved', 'success');
    loadData();
  };

  const handleDeletePopup = async (id: string) => {
    await adminCMSManagementService.deletePopup(id);
    showToast('Popup removed', 'info');
    loadData();
  };

  const handleToggleSection = async (id: string, isEnabled: boolean) => {
    const updated = await adminCMSManagementService.toggleSection(id, isEnabled);
    setSections(updated);
    showToast(`Homepage section ${isEnabled ? 'enabled' : 'hidden'}`, 'info');
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const updated = await adminCMSManagementService.updateSectionOrder(newSections);
    setSections(updated);
    showToast('Homepage section order updated', 'success');
  };

  const handleSaveSEO = async (seoData: HomepageSEOData) => {
    await adminCMSManagementService.saveSEO(seoData);
    setSeo(seoData);
    showToast('SEO & Social Meta Tags saved successfully', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none pb-8"
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

      {/* ── 1. HEADER ── */}
      <AdminCMSHeader
        onNewBanner={() => setIsBannerModalOpen(true)}
        onNewCampaign={() => setIsCampaignModalOpen(true)}
        onNewAnnouncement={() => setIsAnnouncementModalOpen(true)}
        onNewPopup={() => setIsPopupModalOpen(true)}
        onOpenStorefront={() => showToast('Opening customer storefront in new tab', 'info')}
      />

      {/* ── 2. 6 KPI SUMMARY CARDS ── */}
      <CMSKPIStats stats={kpiStats} />

      {/* ── 3. MAIN 3-COLUMN CONTENT & CAMPAIGN STUDIO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (~22% / lg:col-span-3): Navigation */}
        <div className="lg:col-span-3">
          <CMSCategorySidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              banners: banners.length,
              announcements: announcements.length,
              destinations: destinations.length,
              agencies: agencies.length,
              trips: trips.length,
              campaigns: campaigns.length,
              popups: popups.length,
              sections: sections.length,
            }}
          />
        </div>

        {/* Center Column (~48% / lg:col-span-5): Content Editor */}
        <div className="lg:col-span-5">
          {activeTab === 'banners' && (
            <HeroBannerEditor
              banners={banners}
              onSaveBanner={handleSaveBanner}
              onDeleteBanner={handleDeleteBanner}
              onOpenNewModal={() => setIsBannerModalOpen(true)}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementManager
              announcements={announcements}
              onSaveAnnouncement={handleSaveAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onOpenNewModal={() => setIsAnnouncementModalOpen(true)}
            />
          )}

          {activeTab === 'destinations' && (
            <TrendingDestinationsEditor
              destinations={destinations}
              onSaveDestination={handleSaveDestination}
              onDeleteDestination={handleDeleteDestination}
            />
          )}

          {activeTab === 'agencies' && (
            <FeaturedAgenciesEditor
              agencies={agencies}
              onSaveAgency={handleSaveAgency}
              onDeleteAgency={handleDeleteAgency}
            />
          )}

          {activeTab === 'trips' && (
            <FeaturedTripsEditor
              trips={trips}
              onSaveTrip={handleSaveTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          )}

          {activeTab === 'campaigns' && (
            <PromotionalCampaignsEditor
              campaigns={campaigns}
              onSaveCampaign={handleSaveCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onOpenNewModal={() => setIsCampaignModalOpen(true)}
            />
          )}

          {activeTab === 'popups' && (
            <PopupManagerEditor
              popups={popups}
              onSavePopup={handleSavePopup}
              onDeletePopup={handleDeletePopup}
              onOpenNewModal={() => setIsPopupModalOpen(true)}
            />
          )}

          {activeTab === 'sections' && (
            <HomepageSectionsEditor
              sections={sections}
              onToggleSection={handleToggleSection}
              onMoveSection={handleMoveSection}
            />
          )}

          {activeTab === 'seo' && (
            <SEOEditor
              seo={seo}
              onSaveSEO={handleSaveSEO}
            />
          )}
        </div>

        {/* Right Column (~30% / lg:col-span-4): Live Simulated Preview Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <CMSLiveStorefrontPreview
            banners={banners}
            announcements={announcements}
            destinations={destinations}
            agencies={agencies}
            campaigns={campaigns}
          />
        </div>
      </div>

      {/* ── 4. BOTTOM 3 OPERATIONAL WIDGETS ── */}
      <CMSBottomDashboard
        scheduledItems={scheduledItems}
        campaigns={campaigns}
        recentChanges={recentChanges}
      />

      {/* ── 5. QUICK ACTION MODALS ── */}
      <NewBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onCreate={handleSaveBanner}
      />

      <NewAnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onCreate={handleSaveAnnouncement}
      />

      <NewCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onCreate={handleSaveCampaign}
      />

      <NewPopupModal
        isOpen={isPopupModalOpen}
        onClose={() => setIsPopupModalOpen(false)}
        onCreate={handleSavePopup}
      />
    </motion.div>
  );
};

export default AdminCMSPage;
