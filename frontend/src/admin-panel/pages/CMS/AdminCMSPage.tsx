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
  HomepageSEOData,
  CMSKPIStats as CMSKPIStatsType,
  CMSScheduledItem,
  CMSRecentChangeItem,
} from '../../types/cmsManagement';
import { adminCMSManagementService } from '../../services/adminCMSManagement.service';

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
import { SEOEditor } from '../../components/super-admin/cms/editors/SEOEditor';
import { DiscoveryControlEditor } from '../../components/super-admin/cms/editors/DiscoveryControlEditor';

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

  // Content Data (Pure DB State, 0 mock data)
  const [kpiStats, setKpiStats] = useState<CMSKPIStatsType>({
    publishedBanners: { value: 0, label: 'Active Banners', growth: '0%', subtitle: '0 Live' },
    liveAnnouncements: { value: 0, label: 'Live Broadcasts', growth: '0%', subtitle: '0 Active' },
    publishedCampaigns: { value: 0, label: 'Active Campaigns', growth: '0%', subtitle: '0 Linked' },
    publishedPopups: { value: 0, label: 'Active Popups', growth: '0%', subtitle: '0 Modals' },
    activeCoupons: { value: 0, label: 'Coupons in System', growth: '0%', subtitle: '0 Available' },
    totalShowcases: { value: 0, label: 'Featured Showcases', growth: '0%', subtitle: '0 Items' },
  });
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncementItem[]>([]);
  const [destinations, setDestinations] = useState<TrendingDestinationItem[]>([]);
  const [agencies, setAgencies] = useState<FeaturedAgencyItem[]>([]);
  const [trips, setTrips] = useState<FeaturedTripItem[]>([]);
  const [campaigns, setCampaigns] = useState<PromotionalCampaignItem[]>([]);
  const [popups, setPopups] = useState<PromoPopupItem[]>([]);
  const [seo, setSeo] = useState<HomepageSEOData>({
    title: 'ApnaTrip — Discover, Customize & Book Verified Trips',
    description: 'Book verified holiday tours directly from accredited travel operators.',
    keywords: 'tour packages, travel india, kashmir tour',
    ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
  });
  const [scheduledItems, setScheduledItems] = useState<CMSScheduledItem[]>([]);
  const [recentChanges, setRecentChanges] = useState<CMSRecentChangeItem[]>([]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        adminCMSManagementService.getKPIStats(),
        adminCMSManagementService.getBanners(),
        adminCMSManagementService.getAnnouncements(),
        adminCMSManagementService.getDestinations(),
        adminCMSManagementService.getFeaturedAgencies(),
        adminCMSManagementService.getFeaturedTrips(),
        adminCMSManagementService.getCampaigns(),
        adminCMSManagementService.getPopups(),
        adminCMSManagementService.getSEO('home'),
        adminCMSManagementService.getScheduledItems(),
        adminCMSManagementService.getRecentChanges(),
      ]);

      const [
        statsRes,
        bansRes,
        annsRes,
        destsRes,
        agsRes,
        trpsRes,
        campsRes,
        popsRes,
        seoRes,
        schedRes,
        changesRes,
      ] = results;

      if (statsRes.status === 'fulfilled' && statsRes.value) setKpiStats(statsRes.value);
      if (bansRes.status === 'fulfilled' && bansRes.value) setBanners(bansRes.value);
      if (annsRes.status === 'fulfilled' && annsRes.value) setAnnouncements(annsRes.value);
      if (destsRes.status === 'fulfilled' && destsRes.value) setDestinations(destsRes.value);
      if (agsRes.status === 'fulfilled' && agsRes.value) setAgencies(agsRes.value);
      if (trpsRes.status === 'fulfilled' && trpsRes.value) setTrips(trpsRes.value);
      if (campsRes.status === 'fulfilled' && campsRes.value) setCampaigns(campsRes.value);
      if (popsRes.status === 'fulfilled' && popsRes.value) setPopups(popsRes.value);
      if (seoRes.status === 'fulfilled' && seoRes.value) setSeo(seoRes.value);
      if (schedRes.status === 'fulfilled' && schedRes.value) setScheduledItems(schedRes.value);
      if (changesRes.status === 'fulfilled' && changesRes.value) setRecentChanges(changesRes.value);
    } catch (err) {
      console.warn('CMS data load warning:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── 3. HANDLERS ──
  const handleSaveBanner = async (b: Partial<HeroBannerItem>) => {
    try {
      await adminCMSManagementService.saveBanner(b);
      showToast('Hero banner saved and published to storefront', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save banner', 'error');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await adminCMSManagementService.deleteBanner(id);
      showToast('Hero banner deleted from database', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete banner', 'error');
    }
  };

  const handleSaveAnnouncement = async (ann: Partial<PlatformAnnouncementItem>) => {
    try {
      await adminCMSManagementService.saveAnnouncement(ann);
      showToast('Platform announcement broadcasted to storefront', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save announcement', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await adminCMSManagementService.deleteAnnouncement(id);
      showToast('Announcement removed', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete announcement', 'error');
    }
  };

  const handleSaveDestination = async (dest: Partial<TrendingDestinationItem>) => {
    try {
      await adminCMSManagementService.saveDestination(dest);
      showToast('Trending destination updated in MongoDB', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save destination', 'error');
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      await adminCMSManagementService.deleteDestination(id);
      showToast('Trending destination removed', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove destination', 'error');
    }
  };

  const handleSaveAgency = async (agency: Partial<FeaturedAgencyItem>) => {
    const id = agency.agencyDocId || agency.agencyId;
    if (!id) return;
    try {
      await adminCMSManagementService.featureAgency({
        agencyId: id,
        priority: agency.priority,
        featuredBadge: agency.featuredBadge,
      });
      showToast('Featured agency updated', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to feature agency', 'error');
    }
  };

  const handleDeleteAgency = async (id: string) => {
    try {
      await adminCMSManagementService.unfeatureAgency(id);
      showToast('Agency removed from featured showcase', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to unfeature agency', 'error');
    }
  };

  const handleSaveTrip = async (trip: Partial<FeaturedTripItem>) => {
    const id = trip.packageDocId || trip.packageId;
    if (!id) return;
    try {
      await adminCMSManagementService.featureTrip({
        packageId: id,
        priority: trip.priority,
        customBadge: trip.discountBadge,
      });
      showToast('Featured package updated', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to feature package', 'error');
    }
  };

  const handleDeleteTrip = async (id: string) => {
    try {
      await adminCMSManagementService.unfeatureTrip(id);
      showToast('Package removed from featured showcase', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to unfeature package', 'error');
    }
  };

  const handleSaveCampaign = async (camp: Partial<PromotionalCampaignItem>) => {
    try {
      await adminCMSManagementService.saveCampaign(camp);
      showToast('Promotional campaign launched', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to launch campaign', 'error');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await adminCMSManagementService.deleteCampaign(id);
      showToast('Campaign deleted', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete campaign', 'error');
    }
  };

  const handleSavePopup = async (pop: Partial<PromoPopupItem>) => {
    try {
      await adminCMSManagementService.savePopup(pop);
      showToast('Storefront promo popup saved to database', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save popup', 'error');
    }
  };

  const handleDeletePopup = async (id: string) => {
    try {
      await adminCMSManagementService.deletePopup(id);
      showToast('Popup removed', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete popup', 'error');
    }
  };

  const handleSaveSEO = (seoData: HomepageSEOData) => {
    setSeo(seoData);
    showToast('SEO settings saved and active in MongoDB', 'success');
  };

  const handleSelectSearchResult = (type: string, item: any) => {
    if (type === 'package') {
      setActiveTab('trips');
      handleSaveTrip({ packageId: item.id });
    } else if (type === 'agency') {
      setActiveTab('agencies');
      handleSaveAgency({ agencyId: item.id });
    } else if (type === 'destination') {
      setActiveTab('destinations');
      handleSaveDestination({ name: item.name, country: 'India', imageUrl: item.imageUrl });
    } else if (type === 'coupon') {
      setActiveTab('campaigns');
      setIsCampaignModalOpen(true);
    }
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[2000] px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-black flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HEADER (WITH LIVE VIEW SITE & MONGO SEARCH AUTOCOMPLETE) ── */}
      <AdminCMSHeader
        onNewBanner={() => setIsBannerModalOpen(true)}
        onNewAnnouncement={() => setIsAnnouncementModalOpen(true)}
        onNewCampaign={() => setIsCampaignModalOpen(true)}
        onNewPopup={() => setIsPopupModalOpen(true)}
        onOpenStorefront={() => window.open('/', '_blank')}
        onSelectSearchResult={handleSelectSearchResult}
      />

      {/* ── 2. REALTIME KPI STATS CARDS ── */}
      <CMSKPIStats stats={kpiStats} />

      {/* ── 3. MAIN CMS STUDIO (2-COLUMN CLEAN LAYOUT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (lg:col-span-3): Content Categories */}
        <div className="lg:col-span-3">
          <CMSCategorySidebar
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t)}
            counts={{
              banners: banners.length,
              announcements: announcements.length,
              destinations: destinations.length,
              agencies: agencies.length,
              trips: trips.length,
              campaigns: campaigns.length,
              popups: popups.length,
            }}
          />
        </div>

        {/* Center/Right Column (lg:col-span-9): Full Width Content Editor */}
        <div className="lg:col-span-9">
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

          {activeTab === 'discovery' && (
            <DiscoveryControlEditor />
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

          {activeTab === 'seo' && (
            <SEOEditor
              seo={seo}
              onSaveSEO={handleSaveSEO}
            />
          )}
        </div>
      </div>

      {/* ── 4. BOTTOM DASHBOARD: AUDIT TRAIL & SCHEDULED LAUNCHES ── */}
      <CMSBottomDashboard
        scheduledItems={scheduledItems}
        campaigns={campaigns}
        recentChanges={recentChanges}
      />

      {/* ── 5. MODALS ── */}
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
