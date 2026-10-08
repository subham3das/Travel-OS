import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  Briefcase,
  Globe2,
  Car,
  Landmark,
  MapPin,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { AgencySearch } from './components/AgencySearch';
import { AgencyFilter } from './components/AgencyFilter';
import { FeaturedAgencyCard, FeaturedAgency } from './components/FeaturedAgencyCard';
import { AgencyCard, AgencyData } from './components/AgencyCard';
import { AgencyCompareBar } from './components/AgencyCompareBar';
import { SectionHeader } from './components/SectionHeader';
import { FilterModal } from '../../components/common/FilterModal';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { useToast } from '../../context/ToastContext';
import { marketplaceService } from '../../services/marketplace.service';

import { cmsService } from '../../services/cms.service';

// Main initial Agencies List fallback (empty default)
const initialFeaturedAgencies: FeaturedAgency[] = [];

const categoryItems = [
  { id: 'cat-1', title: 'Adventure', icon: <Compass className="w-5 h-5 text-purple-600" />, bgColor: 'bg-purple-50' },
  { id: 'cat-2', title: 'Family', icon: <Users className="w-5 h-5 text-sky-600" />, bgColor: 'bg-sky-50' },
  { id: 'cat-3', title: 'Luxury', icon: <Briefcase className="w-5 h-5 text-amber-600" />, bgColor: 'bg-amber-50' },
  { id: 'cat-4', title: 'Backpacking', icon: <Compass className="w-5 h-5 text-emerald-600" />, bgColor: 'bg-emerald-50' },
  { id: 'cat-5', title: 'Corporate', icon: <Briefcase className="w-5 h-5 text-indigo-600" />, bgColor: 'bg-indigo-50' },
  { id: 'cat-6', title: 'Pilgrimage', icon: <Landmark className="w-5 h-5 text-rose-600" />, bgColor: 'bg-rose-50' },
  { id: 'cat-7', title: 'International', icon: <Globe2 className="w-5 h-5 text-blue-600" />, bgColor: 'bg-blue-50' },
  { id: 'cat-8', title: 'Road Trips', icon: <Car className="w-5 h-5 text-teal-600" />, bgColor: 'bg-teal-50' },
];

const recentlyJoinedAgencies: Array<{ id: string; name: string; tag: string; logo: string }> = [];
const nearbyAgenciesList: Array<{ id: string; name: string; distance: string; rating: number }> = [];

export const AgencyListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('verified');
  const [sortMode, setSortMode] = useState<'recommended' | 'rating' | 'reviews'>('recommended');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [agenciesList, setAgenciesList] = useState<AgencyData[]>([]);
  const [featuredList, setFeaturedList] = useState<FeaturedAgency[]>(initialFeaturedAgencies);
  const [selectedForCompare, setSelectedForCompare] = useState<AgencyData[]>([]);

  useEffect(() => {
    // 1. Fetch featured agencies directly from CMS
    cmsService.getHomeData().then((cms) => {
      if (cms?.featuredAgencies && cms.featuredAgencies.length > 0) {
        setFeaturedList(
          cms.featuredAgencies.map((fa) => ({
            id: fa.agencyId,
            name: fa.name,
            isVerified: fa.isVerified,
            featuredBadge: fa.featuredBadge,
            rating: fa.rating,
            reviewsCount: fa.reviewsCount,
            tripsCompleted: '120+',
            specialization: 'Verified Specialist',
            coverImageUrl: fa.coverImageUrl,
            logoUrl: fa.logoUrl,
          }))
        );
      }
    }).catch(console.error);

    // 2. Fetch full agency directory
    marketplaceService.getAgencies({ limit: 20 }).then((res) => {
      if (res.agencies && res.agencies.length > 0) {
        const mappedMain: AgencyData[] = res.agencies.map((a) => ({
          id: a.id,
          name: a.name,
          isVerified: a.isVerified,
          badges: [
            { text: a.isVerified ? 'Verified Partner' : 'Authorized', variant: 'green' },
            { text: `${a.yearsExperience}+ Years Exp`, variant: 'blue' },
          ],
          rating: a.rating,
          reviewsCount: a.reviewCount,
          location: a.location,
          yearsExperience: `${a.yearsExperience}+ Years`,
          tripsCompleted: a.tripsCompleted,
          languagesCount: String(a.languagesCount || 3),
          specializationTags: a.specializationTags,
          startingPrice: a.startingPrice,
          responseTime: a.responseTime,
          coverImageUrl: a.coverImage,
          logoUrl: a.logo,
        }));
        setAgenciesList(mappedMain);
      }
    }).catch((err) => console.warn('Failed to load agencies in AgencyListingPage:', err));
  }, []);

  const handleCompareToggle = (agency: AgencyData) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((a) => a.id === agency.id);
      if (exists) {
        return prev.filter((a) => a.id !== agency.id);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare up to 3 agencies at a time.', 'info');
          return prev;
        }
        return [...prev, agency];
      }
    });
  };

  const handleRemoveCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((a) => a.id !== id));
  };

  const sortedAgencies = [...agenciesList]
    .filter((a) => {
      if (activeFilter === 'top_rated') return a.rating >= 4.8;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q) ||
          a.specializationTags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortMode === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortMode === 'reviews') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0;
    });

  const activeRecentlyJoined = recentlyJoinedAgencies.length > 0
    ? recentlyJoinedAgencies
    : agenciesList.slice(0, 5).map((a) => ({
        id: a.id,
        name: a.name,
        tag: a.location || 'Verified Partner',
        logo: a.logoUrl || a.coverImageUrl || '',
      }));

  const activeNearbyList = nearbyAgenciesList.length > 0
    ? nearbyAgenciesList
    : agenciesList.slice(0, 4).map((a) => ({
        id: a.id,
        name: a.name,
        distance: 'Nearby (5 km)',
        rating: a.rating,
      }));

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={3}
        unreadMessagesCount={2}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* 2. Sticky Search Bar & Filter Section (Always pinned below AppHeader, does not cut off) */}
      <section className="sticky top-16 z-30 w-full bg-[#F8F9FC]/98 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 space-y-3">
          {/* Page Title & Subtitle */}
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Verified Travel Agencies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Find trusted agencies for your next adventure.
            </p>
          </div>

          {/* Search Bar */}
          <AgencySearch
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />

          {/* Filter Pills */}
          <AgencyFilter
            activeFilter={activeFilter}
            onFilterChange={(id) => setActiveFilter(id)}
          />
        </div>
      </section>

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-32">
        {/* 3. Section 1: Featured Agencies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3.5"
        >
          {featuredList.length > 0 && (
            <>
              <SectionHeader
                title="Featured Agencies"
                onViewAll={() => setActiveFilter('featured')}
              />

              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {featuredList.map((agency) => (
                  <FeaturedAgencyCard
                    key={agency.id}
                    agency={agency}
                    onViewAgency={(ag) => navigate(`/agencies/${ag.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </motion.section>

        {/* 5. Section 2: Main Agency Listing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              All Agencies
            </h3>
            <button
              type="button"
              onClick={() =>
                setSortMode((prev) =>
                  prev === 'recommended' ? 'rating' : prev === 'rating' ? 'reviews' : 'recommended'
                )
              }
              className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              {sortMode === 'recommended'
                ? 'Sort: Recommended ▾'
                : sortMode === 'rating'
                ? 'Sort: Highest Rating ▾'
                : 'Sort: Most Reviews ▾'}
            </button>
          </div>

          <div className="space-y-4">
            {sortedAgencies.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A]">No Agencies Available</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No verified travel agencies found. Please check back later.
                </p>
              </div>
            ) : (
              sortedAgencies.map((agency) => (
                <AgencyCard
                  key={agency.id}
                  agency={agency}
                  isCompared={selectedForCompare.some((a) => a.id === agency.id)}
                  onCompareToggle={handleCompareToggle}
                  onViewAgency={(ag) => navigate(`/agencies/${ag.id}`)}
                />
              ))
            )}
          </div>
        </motion.section>

        {/* 6. Section 3: Popular Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3.5"
        >
          <SectionHeader title="Popular Categories" onViewAll={() => setActiveFilter('all')} />

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-4">
            {categoryItems.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSearchQuery(cat.title)}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${cat.bgColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                  {cat.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 7. Section 4: Recently Joined & Nearby Agencies */}
        {(activeRecentlyJoined.length > 0 || activeNearbyList.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recently Joined */}
            {activeRecentlyJoined.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-7 space-y-3.5"
              >
                <SectionHeader title="Recently Joined" onViewAll={() => setActiveFilter('all')} />

                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {activeRecentlyJoined.map((rj) => (
                    <div
                      key={rj.id}
                      onClick={() => navigate(`/agencies/${rj.id}`)}
                      className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex flex-col items-center text-center w-32 sm:w-36 shrink-0 space-y-2 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-slate-200">
                        <img src={rj.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100'} alt={rj.name} className="w-full h-full object-cover" />
                        <span className="absolute top-0 left-0 px-1 py-0.2 bg-[#6356E5] text-white text-[8px] font-bold rounded-br">
                          New
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#0F172A] line-clamp-1">{rj.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{rj.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nearby Agencies */}
            {activeNearbyList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 space-y-3.5"
              >
                <SectionHeader title="Nearby Agencies" onViewAll={() => setActiveFilter('all')} />

                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
                  {activeNearbyList.map((nb) => (
                    <div
                      key={nb.id}
                      onClick={() => navigate(`/agencies/${nb.id}`)}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#6356E5] font-extrabold flex items-center justify-center text-xs">
                          {nb.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#0F172A]">{nb.name}</h5>
                          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6356E5]" />
                            {nb.distance} <span className="text-slate-300">•</span> ★ {nb.rating}
                          </p>
                        </div>
                      </div>

                      <button className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-[#6356E5] text-[#6356E5] hover:text-white text-xs font-bold transition-all focus:outline-none shrink-0 cursor-pointer">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* 4. Floating Agency Compare Bar */}
      <AgencyCompareBar
        selectedAgencies={selectedForCompare}
        onRemoveAgency={handleRemoveCompare}
        onCompareNow={() => setIsCompareModalOpen(true)}
      />

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0F172A]">Agency Comparison</h3>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              {selectedForCompare.map((ag) => (
                <div key={ag.id} className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                  <h4 className="font-extrabold text-[#0F172A]">{ag.name}</h4>
                  <p className="text-slate-500">Rating: ★ {ag.rating}</p>
                  <p className="text-slate-500">Location: {ag.location}</p>
                  <p className="text-[#6356E5] font-extrabold">Starting: {ag.startingPrice}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#0F172A] text-white text-xs font-extrabold cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => setSearchQuery(f.category !== 'all' ? f.category : '')}
      />

      {/* 10. Bottom Navigation Bar */}
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default AgencyListingPage;
