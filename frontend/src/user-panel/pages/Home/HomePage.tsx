import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/home/AppHeader';
import { GreetingCard } from '../../components/home/GreetingCard';
import { SearchBar } from '../../components/home/SearchBar';
import { HeroCarousel, HeroSlide } from '../../components/home/HeroCarousel';
import { CategoryGrid, CategoryItem } from '../../components/home/CategoryGrid';
import { SectionHeader } from '../../components/common/SectionHeader';
import { DestinationCard, Destination } from '../../components/home/DestinationCard';
import { TravelerStoryCard } from '../../components/home/TravelerStoryCard';
import { PackageCard, TravelPackage } from '../../components/home/PackageCard';
import { NewsletterSection } from '../../components/home/NewsletterSection';
import { TopTravelCategories } from '../../components/home/TopTravelCategories';
import { AppDownloadBanner } from '../../components/home/AppDownloadBanner';
import { FilterModal } from '../../components/common/FilterModal';
import { BottomNavigation } from '../../components/common/BottomNavigation';

// Sample Mock Data matching reference designs (home.png & home extended.png)
const featuredDestinationsData: Destination[] = [
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    location: 'Northeast India',
    rating: 4.8,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    location: 'Jammu & Kashmir',
    rating: 4.9,
    reviewsCount: 415,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    location: 'Himachal Pradesh',
    rating: 4.9,
    reviewsCount: 280,
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters',
    location: 'Kerala',
    rating: 4.7,
    reviewsCount: 190,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
  },
];

const trendingPackagesData: TravelPackage[] = [
  {
    id: 'pkg-1',
    badge: 'Best Seller',
    title: 'Kedarkantha Trek',
    price: '₹5,999',
    rating: 4.7,
    reviewsCount: 128,
    duration: '5 Days',
    location: 'Uttarakhand',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pkg-2',
    badge: 'Popular',
    title: 'Goa Beach Escape',
    price: '₹7,999',
    rating: 4.6,
    reviewsCount: 96,
    duration: '4 Days',
    location: 'Goa',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pkg-3',
    badge: 'New',
    title: 'Sikkim Explorer',
    price: '₹8,999',
    rating: 4.8,
    reviewsCount: 76,
    duration: '6 Days',
    location: 'Sikkim',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pkg-4',
    badge: 'Weekend',
    title: 'Nainital Getaway',
    price: '₹4,499',
    rating: 4.5,
    reviewsCount: 54,
    duration: '3 Days',
    location: 'Uttarakhand',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
];

const recentlyViewedData: Destination[] = [
  {
    id: 'rv-1',
    name: 'Meghalaya',
    location: "India's Scotland",
    rating: 4.8,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rv-2',
    name: 'Ladakh',
    location: 'Land of High Passes',
    rating: 4.9,
    reviewsCount: 415,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rv-3',
    name: 'Kedarkantha Trek',
    location: 'Uttarakhand',
    rating: 4.7,
    reviewsCount: 128,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rv-4',
    name: 'Goa',
    location: 'Beach Paradise',
    rating: 4.6,
    reviewsCount: 96,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleDestinationExplore = (dest: Destination) => {
    navigate(`/explore?destination=${dest.id}`);
  };

  const handlePackageBook = (pkg: TravelPackage) => {
    navigate(`/package/${pkg.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={2}
        unreadMessagesCount={1}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 sm:space-y-10 pb-28">
        {/* 2. Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GreetingCard
            userName="Subham Das"
            location="Dibrugarh"
            temperature="28°C"
          />
        </motion.div>

        {/* 3. Search Bar */}
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

        {/* 4. Hero Carousel Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HeroCarousel
            onExploreClick={(slide: HeroSlide) => navigate('/explore')}
          />
        </motion.div>

        {/* 5. Quick Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CategoryGrid
            onCategoryClick={(cat: CategoryItem) => navigate(cat.path)}
          />
        </motion.div>

        {/* 6. Featured Destinations Horizontal Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader
            title="Featured Destinations"
            onViewAll={() => navigate('/explore')}
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredDestinationsData.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onExplore={handleDestinationExplore}
              />
            ))}
          </div>
        </motion.section>

        {/* 7. Traveler Story Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <TravelerStoryCard
            onReadStory={(story) => navigate('/community')}
          />
        </motion.section>

        {/* 8. Trending Packages Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader
            title="Trending Packages"
            emoji="🔥"
            onViewAll={() => navigate('/explore?tab=packages')}
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingPackagesData.map((pkg) => (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                onBook={handlePackageBook}
              />
            ))}
          </div>
        </motion.section>

        {/* 9. Newsletter Subscription Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <NewsletterSection />
        </motion.section>

        {/* 10. Top Travel Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <TopTravelCategories
            onCategoryClick={() => navigate('/explore')}
          />
        </motion.section>

        {/* 11. Recently Viewed Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader
            title="Recently Viewed"
            onViewAll={() => navigate('/explore')}
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {recentlyViewedData.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onExplore={handleDestinationExplore}
              />
            ))}
          </div>
        </motion.section>

        {/* 12. App Download Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <AppDownloadBanner />
        </motion.section>
      </main>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => navigate(`/search?q=${encodeURIComponent(f.category)}`)}
      />

      {/* 13. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default HomePage;
