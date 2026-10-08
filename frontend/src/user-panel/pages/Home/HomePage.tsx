import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/home/AppHeader';
import { GreetingCard } from '../../components/home/GreetingCard';
import { SearchBar } from '../../components/home/SearchBar';
import { HeroCarousel, HeroSlide } from '../../components/home/HeroCarousel';
import { CategoryGrid, CategoryItem } from '../../components/home/CategoryGrid';
import { SectionHeader } from '../../components/common/SectionHeader';
import { DestinationCard, Destination } from '../../components/home/DestinationCard';
import { PackageCard, TravelPackage } from '../../components/home/PackageCard';
import { NewsletterSection } from '../../components/home/NewsletterSection';
import { TopTravelCategories } from '../../components/home/TopTravelCategories';
import { AppDownloadBanner } from '../../components/home/AppDownloadBanner';
import { FilterModal } from '../../components/common/FilterModal';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { CurrentTripCard } from '../../components/dashboard/CurrentTripCard';
import { TravelProfileDashboardCard } from '../../components/dashboard/TravelProfileDashboardCard';
import { useAuth } from '../../hooks/useAuth';
import { cmsService, CMSHomeResponse } from '../../services/cms.service';
import { discoveryService } from '../../services/discovery.service';
import { DiscoverySection } from '../../types/discovery';
import { userSocketService } from '../../services/userSocket.service';
import { X, Megaphone, Star, CheckCircle, ArrowRight, Users, Fuel } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Real CMS & Discovery Data State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<Set<string>>(new Set());
  const [discoverySections, setDiscoverySections] = useState<DiscoverySection[]>([]);
  const [activePopup, setActivePopup] = useState<any | null>(null);
  const [isPopupDismissed, setIsPopupDismissed] = useState(false);

  const loadCMS = useCallback(async () => {
    try {
      const feed = await discoveryService.getHomepageFeed();
      if (!feed) return;

      // 1. Hero Slides (Manual CMS Banners)
      if (feed.heroBanners && feed.heroBanners.length > 0) {
        setHeroSlides(
          feed.heroBanners.map((b) => ({
            id: b.id,
            titlePrefix: '',
            titleBold: b.title,
            description: b.subtitle || '',
            ctaText: b.ctaText || 'Explore Now',
            imageUrl: b.desktopImage,
            targetType: b.targetType as any,
            targetId: b.targetId,
            externalUrl: b.externalUrl,
            tag: 'FEATURED',
          }))
        );
      } else {
        setHeroSlides([]);
      }

      // 2. Announcements
      if (feed.announcements) {
        setAnnouncements(
          feed.announcements.map((a: any) => ({
            id: a.id,
            title: a.message,
            description: '',
            placement: 'all',
            priority: 1,
            isEnabled: true,
            status: 'published',
            bgColor: a.bgColor || '#583BE8',
            textColor: a.textColor || '#FFFFFF',
            linkUrl: a.linkUrl,
            ctaText: a.linkText,
            isDismissible: true,
          }))
        );
      }

      // 3. Dynamic Discovery Sections (MongoDB -> Ranking Engine -> CMS Overrides)
      if (feed.sections) {
        setDiscoverySections(feed.sections);
      }

      // 4. Active Popup
      if (feed.popup) {
        const popupKey = `apnatrip_popup_${feed.popup.id}`;
        let shouldShow = true;
        if (feed.popup.frequency === 'once_per_user' && localStorage.getItem(popupKey)) {
          shouldShow = false;
        } else if (feed.popup.frequency === 'once_per_session' && sessionStorage.getItem(popupKey)) {
          shouldShow = false;
        }
        if (shouldShow) {
          setTimeout(() => {
            setActivePopup(feed.popup);
          }, (feed.popup.delaySeconds || 3) * 1000);
        }
      }

      // 5. SEO tags injection
      if (feed.seo) {
        document.title = feed.seo.title || 'ApnaTrip — Verified Group Trips in India';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && feed.seo.description) {
          metaDesc.setAttribute('content', feed.seo.description);
        }
      }
    } catch (err) {
      console.warn('Discovery homepage load error:', err);
    }
  }, []);

  useEffect(() => {
    loadCMS();

    // Subscribe to real-time socket events for CMS updates
    const unsubscribe = userSocketService.subscribe('cms:content_updated', () => {
      console.log('⚡ Realtime CMS update received. Refreshing homepage...');
      loadCMS();
    });

    return () => {
      unsubscribe();
    };
  }, [loadCMS]);

  const handleDismissAnnouncement = (id: string) => {
    setDismissedAnnouncements((prev) => new Set([...prev, id]));
  };

  const handleDismissPopup = () => {
    if (activePopup) {
      const popupKey = `apnatrip_popup_${activePopup.id}`;
      if (activePopup.frequency === 'once_per_user') {
        localStorage.setItem(popupKey, 'seen');
      } else {
        sessionStorage.setItem(popupKey, 'seen');
      }
    }
    setIsPopupDismissed(true);
  };

  const handleHeroExplore = (slide: HeroSlide) => {
    if (slide.targetType === 'Package' && slide.targetId) {
      navigate(`/package/${slide.targetId}`);
    } else if (slide.targetType === 'Agency' && slide.targetId) {
      navigate(`/agency/${slide.targetId}`);
    } else if (slide.targetType === 'Destination' && slide.targetId) {
      navigate(`/explore?destination=${slide.targetId}`);
    } else if (slide.targetType === 'Car Rental') {
      navigate('/car-rental');
    } else if (slide.targetType === 'External' && slide.externalUrl) {
      window.open(slide.externalUrl, '_blank');
    } else {
      navigate('/explore');
    }
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedAnnouncements.has(a.id)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={0}
        unreadMessagesCount={0}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* 2. Real-Time Announcement Banners Strip */}
      <AnimatePresence>
        {visibleAnnouncements.length > 0 && (
          <div className="w-full space-y-1.5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-3">
            {visibleAnnouncements.map((ann) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                style={{
                  backgroundColor: ann.bgColor || '#3B82F6',
                  color: ann.textColor || '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <div className="text-xs truncate">
                    <span className="font-extrabold mr-1.5">{ann.title}</span>
                    {ann.description && (
                      <span className="opacity-90 font-medium hidden sm:inline">
                        — {ann.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ann.ctaText && ann.linkUrl && (
                    <button
                      onClick={() =>
                        ann.linkUrl?.startsWith('http')
                          ? window.open(ann.linkUrl, '_blank')
                          : navigate(ann.linkUrl || '/')
                      }
                      className="text-xs underline font-bold px-2 py-0.5 rounded-md hover:bg-black/10 cursor-pointer"
                    >
                      {ann.ctaText} →
                    </button>
                  )}
                  {ann.isDismissible && (
                    <button
                      onClick={() => handleDismissAnnouncement(ann.id)}
                      className="p-1 rounded-full hover:bg-black/15 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 sm:space-y-10 pb-28">
        {/* 3. Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GreetingCard
            userName={user?.name || 'Traveler'}
            location={user?.homeCity || 'India'}
            temperature="28°C"
          />
        </motion.div>

        {/* 4. Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SearchBar
            onSearch={(q) => setSearchQuery(q)}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />
        </motion.div>

        {/* 4.5. Live Backend-Driven Current Trip Widget (Hidden when no active ongoing trip) */}
        <CurrentTripCard hideIfNoTrip />

        {/* 4.6. Travel Profile & Saved Travelers Card */}
        <TravelProfileDashboardCard />

        {/* 5. CMS-Driven Hero Carousel Banner */}
        {heroSlides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HeroCarousel
              slides={heroSlides}
              onExploreClick={handleHeroExplore}
            />
          </motion.div>
        )}

        {/* 6. Quick Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CategoryGrid
            onCategoryClick={(cat: CategoryItem) => navigate(cat.path)}
          />
        </motion.div>

        {/* 7. Dynamic Discovery Engine Sections (MongoDB -> Ranking -> CMS Overrides) */}
        {discoverySections.map((section) => (
          <motion.section
            key={`home-sec-${section.sectionId}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <SectionHeader
              title={section.title}
              emoji={section.emoji || '✨'}
              onViewAll={() =>
                section.viewAllLink
                  ? navigate(section.viewAllLink)
                  : navigate(`/explore?section=${section.sectionId}`)
              }
            />

            {section.subtitle && (
              <p className="text-xs text-slate-400 font-medium -mt-2">
                {section.subtitle}
              </p>
            )}

            {/* A. Package Sections */}
            {section.type === 'package' && (
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {section.items.map((pkg, idx) => (
                  <PackageCard
                    key={pkg._id || pkg.id || `pkg-${section.sectionId}-${idx}`}
                    packageData={{
                      id: pkg.packageId || pkg.id,
                      badge: (pkg.badge as any) || (pkg.isPinned ? "Editor's Pick" : 'Popular'),
                      title: pkg.title,
                      price: pkg.price,
                      rating: pkg.rating || 4.8,
                      reviewsCount: pkg.reviewCount || 0,
                      duration: pkg.duration,
                      location: pkg.destinationName || pkg.location,
                      imageUrl: pkg.imageUrl || pkg.coverImage,
                    }}
                    onBook={(p) => navigate(`/package/${p.id}`)}
                  />
                ))}
              </div>
            )}

            {/* B. Agency Showcase Sections */}
            {section.type === 'agency' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {section.items.map((ag, idx) => (
                  <div
                    key={ag._id || ag.id || `ag-${idx}`}
                    onClick={() => navigate(`/agencies/${ag.agencyId || ag.id}`)}
                    className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ag.logoUrl || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100'}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-[#6356E5] transition-colors">
                            {ag.name}
                          </h4>
                          {ag.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          ★ {ag.rating} ({ag.reviewsCount} reviews) • <span className="text-emerald-600 font-bold">{ag.badge || 'Verified Partner'}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#6356E5] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* C. Destination Showcase Sections */}
            {section.type === 'destination' && (
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {section.items.map((dest, idx) => (
                  <DestinationCard
                    key={dest.id || `dest-${idx}`}
                    destination={{
                      id: dest.id || String(idx),
                      name: dest.name,
                      location: dest.country || 'India',
                      rating: dest.rating || 4.8,
                      reviewsCount: dest.reviewsCount || 80,
                      imageUrl: dest.imageUrl,
                    }}
                    onExplore={(d) => navigate(`/explore?destination=${d.name}`)}
                  />
                ))}
              </div>
            )}

            {/* D. Car Rental Showcase Sections */}
            {section.type === 'car_rental' && (
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {section.items.map((car, idx) => (
                  <div
                    key={car._id || car.id || `car-${idx}`}
                    onClick={() => navigate('/car-rental')}
                    className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between shrink-0 w-72 sm:w-80 cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-slate-800 uppercase tracking-wider shadow-xs">
                          {car.type}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400">{car.agencyName}</span>
                          <span className="text-xs font-black text-amber-500">★ {car.rating}</span>
                        </div>
                        <h4 className="text-sm font-black text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
                          {car.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {car.specs?.seats || 5} Seats
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3.5 h-3.5 text-slate-400" />
                          {car.specs?.fuel || 'Diesel'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">STARTING AT</span>
                        <span className="text-sm font-black text-[#583BE8]">{car.price}</span>
                      </div>
                      <span className="p-2 rounded-xl bg-purple-50 group-hover:bg-[#583BE8] text-[#583BE8] group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        ))}

        {/* 11. Top Travel Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <TopTravelCategories
            onViewAll={() => navigate('/explore')}
            onCategoryClick={(cat) =>
              navigate(
                cat.id === 'more'
                  ? '/explore'
                  : `/explore?category=${encodeURIComponent(cat.title)}`
              )
            }
          />
        </motion.section>

        {/* 12. Newsletter Subscription Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <NewsletterSection />
        </motion.section>

        {/* 13. App Download Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <AppDownloadBanner />
        </motion.section>
      </main>

      {/* ── CMS PROMO POPUP MODAL ── */}
      <AnimatePresence>
        {activePopup && !isPopupDismissed && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={handleDismissPopup}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {activePopup.hasCloseButton && (
                <button
                  onClick={handleDismissPopup}
                  className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <img
                src={activePopup.mediaUrl}
                alt=""
                className="w-full h-44 object-cover"
              />

              <div className="p-5 pt-0 space-y-3 text-center">
                <h3 className="text-base font-black text-slate-900">{activePopup.title}</h3>
                {activePopup.description && (
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {activePopup.description}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleDismissPopup();
                    if (activePopup.buttonLink?.startsWith('http')) {
                      window.open(activePopup.buttonLink, '_blank');
                    } else if (activePopup.buttonLink) {
                      navigate(activePopup.buttonLink);
                    }
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white font-black text-xs shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
                >
                  {activePopup.buttonText || 'Claim Offer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => navigate(`/search?q=${encodeURIComponent(f.category)}`)}
      />

      {/* Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default HomePage;
