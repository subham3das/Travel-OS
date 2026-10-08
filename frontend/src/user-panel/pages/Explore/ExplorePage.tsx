import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Car,
  Fuel,
  Users,
  Search,
  RotateCcw,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { SearchBar } from '../../components/home/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PackageCard } from '../../components/home/PackageCard';
import { AgencyCard } from '../../components/explore/AgencyCard';
import { DestinationCard } from '../../components/home/DestinationCard';
import { FilterModal } from '../../components/common/FilterModal';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { discoveryService } from '../../services/discovery.service';
import { DiscoverySection } from '../../types/discovery';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentAdventureType = searchParams.get('adventureType') || 'All';
  const currentSearch = searchParams.get('search') || '';

  const [activeFilter, setActiveFilter] = useState<string>(currentCategory);
  const [activeAdventureType, setActiveAdventureType] = useState<string>(currentAdventureType);
  const [searchQuery, setSearchQuery] = useState<string>(currentSearch);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [adventureTypes, setAdventureTypes] = useState<string[]>(['All']);
  const [sections, setSections] = useState<DiscoverySection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const loadFeed = useCallback(async (cat: string, advType: string, search: string) => {
    setLoading(true);
    try {
      const feed = await discoveryService.getExploreFeed({
        category: cat !== 'All' ? cat : undefined,
        adventureType: advType !== 'All' ? advType : undefined,
        search: search.trim() ? search.trim() : undefined,
      });

      setSections(feed.sections || []);
      if (feed.categories && feed.categories.length > 0) {
        setCategories(feed.categories);
      }
      if (feed.adventureTypes && feed.adventureTypes.length > 0) {
        setAdventureTypes(feed.adventureTypes);
      }
    } catch (err) {
      console.warn('Failed to load explore discovery feed:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(activeFilter, activeAdventureType, searchQuery);
  }, [activeFilter, activeAdventureType, searchQuery, loadFeed]);

  const handleCategorySelect = (cat: string) => {
    setActiveFilter(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleAdventureTypeSelect = (advType: string) => {
    setActiveAdventureType(advType);
    const newParams = new URLSearchParams(searchParams);
    if (advType === 'All') {
      newParams.delete('adventureType');
    } else {
      newParams.set('adventureType', advType);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (q: string) => {
    setSearchQuery(q);
    const newParams = new URLSearchParams(searchParams);
    if (!q.trim()) {
      newParams.delete('search');
    } else {
      newParams.set('search', q.trim());
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setActiveFilter('All');
    setActiveAdventureType('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#583BE8]/20 selection:text-[#583BE8]">
      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={0}
        unreadMessagesCount={0}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-28">
        {/* 2. Page Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-xs font-black text-[#583BE8] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Dynamic Discovery Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Explore Packages & Journeys
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Discover verified tours, certified operators, and scenic getaways live from across India.
          </p>
        </motion.div>

        {/* 3. Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SearchBar
            placeholder="Search destinations, tour categories, verified operators..."
            onSearch={handleSearchSubmit}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />
        </motion.div>

        {/* 4. Quick Category Filter Chips (Loaded from MongoDB) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat) => {
            const isActive = activeFilter.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={`cat-chip-${cat}`}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isActive
                    ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/25 scale-102'
                    : 'bg-white text-slate-600 hover:text-[#0F172A] border border-slate-100 hover:border-slate-200'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* 4.5. Dynamic Adventure Type Filter Chips */}
        {adventureTypes && adventureTypes.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 -mt-4 sm:-mt-6"
          >
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 pl-1">
              Adventure:
            </span>
            {adventureTypes.map((adv) => {
              const isActive = activeAdventureType.toLowerCase() === adv.toLowerCase();
              return (
                <button
                  key={`adv-chip-${adv}`}
                  type="button"
                  onClick={() => handleAdventureTypeSelect(adv)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-black scale-102'
                      : 'bg-white text-slate-600 hover:text-[#0F172A] border border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span>{adv}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* 5. Loading Skeletons */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={`skel-sec-${i}`} className="space-y-4">
                <div className="h-6 bg-slate-200 rounded-md w-48" />
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={`skel-card-${card}`}
                      className="w-72 h-80 bg-slate-100 rounded-3xl shrink-0 border border-slate-200/60"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. Empty State if 0 sections match */}
        {!loading && sections.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto text-2xl font-black">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">No Matching Discovery Sections Found</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
                No active packages matched your current filter criteria. Try selecting another category or clear your search terms.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#583BE8] text-white text-xs font-black shadow-md hover:bg-[#472bd1] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* 7. Fully Dynamic Backend Discovery Sections */}
        {!loading &&
          sections.map((section) => (
            <motion.section
              key={`section-${section.sectionId}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              className="space-y-3.5"
            >
              <SectionHeader
                title={section.title}
                emoji={section.emoji || '✨'}
                onViewAll={
                  section.viewAllLink
                    ? () => navigate(section.viewAllLink!)
                    : () => navigate(`/explore?tab=packages&section=${section.sectionId}`)
                }
              />

              {section.subtitle && (
                <p className="text-xs text-slate-500 font-medium -mt-2">
                  {section.subtitle}
                </p>
              )}

              {/* RENDER BY SECTION TYPE */}

              {/* A. Package Sections */}
              {section.type === 'package' && (
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {section.items.map((pkg, idx) => (
                    <PackageCard
                      key={pkg._id || pkg.id || `pkg-${section.sectionId}-${idx}`}
                      packageData={{
                        id: pkg.packageId || pkg.id,
                        badge: (pkg.badge as any) || (pkg.isPinned ? 'Editor’s Pick' : 'Popular'),
                        title: pkg.title,
                        price: pkg.price,
                        rating: pkg.rating || 4.8,
                        reviewsCount: pkg.reviewCount || 0,
                        duration: pkg.duration,
                        location: pkg.destinationName || pkg.location,
                        imageUrl: pkg.imageUrl || pkg.coverImage,
                        adventureType: pkg.adventureType,
                      }}
                      onBook={(p) => navigate(`/package/${p.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* B. Agency Showcase Sections */}
              {section.type === 'agency' && (
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {section.items.map((ag, idx) => (
                    <AgencyCard
                      key={ag._id || ag.id || `ag-${idx}`}
                      agency={{
                        id: ag.agencyId || ag.id,
                        name: ag.name,
                        logoUrl: ag.logoUrl,
                        isVerified: ag.isVerified,
                        rating: ag.rating || 4.9,
                        reviewsCount: ag.reviewsCount || 0,
                        specialization: ag.specialization || 'Adventure Operator',
                        tripsCompleted: `${ag.tripsCompleted || 12}+ Trips`,
                        bgColor: idx % 2 === 0 ? 'bg-[#0F172A] text-white' : 'bg-[#583BE8] text-white',
                      }}
                      onViewAgency={(agency) => navigate(`/agencies/${agency.id}`)}
                    />
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

                      <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between">
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
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={{
          category: activeFilter,
          adventureType: activeAdventureType,
        }}
        onApply={(filters) => {
          setIsFilterModalOpen(false);
          const newParams = new URLSearchParams(searchParams);

          if (filters?.category && filters.category !== 'all' && filters.category !== 'All') {
            setActiveFilter(filters.category);
            newParams.set('category', filters.category);
          } else {
            setActiveFilter('All');
            newParams.delete('category');
          }

          if (filters?.adventureType && filters.adventureType !== 'all' && filters.adventureType !== 'All') {
            setActiveAdventureType(filters.adventureType);
            newParams.set('adventureType', filters.adventureType);
          } else {
            setActiveAdventureType('All');
            newParams.delete('adventureType');
          }

          setSearchParams(newParams);
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ExplorePage;
