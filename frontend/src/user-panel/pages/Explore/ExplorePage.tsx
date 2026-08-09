import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Palmtree,
  Heart,
  User,
  Users,
  Laptop,
  Sparkles,
  Grid,
  MapPin,
  Star,
  Mountain,
  Camera,
  Utensils,
  Tent,
  Landmark,
  ShieldCheck,
  Tag,
  MessageSquare,
  Headphones,
  ArrowRight,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { SearchBar } from '../../components/home/SearchBar';
import { FilterChip, FilterChipOption } from '../../components/explore/FilterChip';
import { SectionHeader } from '../../components/common/SectionHeader';
import { MoodCard, MoodItem } from '../../components/explore/MoodCard';
import { AgencyCard, TravelAgency } from '../../components/explore/AgencyCard';
import { FestivalCard, FestivalItem } from '../../components/explore/FestivalCard';
import { CommunityCard, CommunityPick } from '../../components/explore/CommunityCard';
import { PackageCard, TravelPackage } from '../../components/home/PackageCard';
import { FaqAccordion } from '../../components/explore/FaqAccordion';
import { BottomNavigation } from '../../components/common/BottomNavigation';

// Sample Mock Data matching explore.png & explore extended.png
const filterOptions: FilterChipOption[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'weekend', label: 'Weekend', icon: '📅' },
  { id: 'budget', label: 'Budget', icon: '👛' },
  { id: 'solo', label: 'Solo', icon: '👤' },
  { id: 'couple', label: 'Couple', icon: '❤️' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'nature', label: 'Nature', icon: '🏞️' },
  { id: 'mountains', label: 'Mountains', icon: '⛰️' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'hidden-gems', label: 'Hidden Gems', icon: '💎' },
];

const trendingDestinations = [
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    rating: 4.8,
    reviewsCount: '1.2K',
    price: '₹6,999',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    rating: 4.7,
    reviewsCount: '832',
    price: '₹7,999',
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    rating: 4.6,
    reviewsCount: '2.1K',
    price: '₹22,999',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    rating: 4.7,
    reviewsCount: '1.5K',
    price: '₹9,499',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
  },
];

const moodItems: MoodItem[] = [
  {
    id: 'adventure',
    title: 'Adventure',
    icon: <Compass className="w-6 h-6" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'relax',
    title: 'Relax',
    icon: <Palmtree className="w-6 h-6" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'romantic',
    title: 'Romantic',
    icon: <Heart className="w-6 h-6" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
  {
    id: 'solo',
    title: 'Solo',
    icon: <User className="w-6 h-6" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'family',
    title: 'Family',
    icon: <Users className="w-6 h-6" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'workation',
    title: 'Workation',
    icon: <Laptop className="w-6 h-6" />,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'spiritual',
    title: 'Spiritual',
    icon: <Sparkles className="w-6 h-6" />,
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    id: 'more',
    title: 'More',
    icon: <Grid className="w-6 h-6" />,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

const hiddenGems = [
  {
    id: 'tawang',
    name: 'Tawang',
    location: 'Arunachal Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'majuli',
    name: 'Majuli',
    location: 'Assam',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ziro',
    name: 'Ziro Valley',
    location: 'Arunachal Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'chopta',
    name: 'Chopta',
    location: 'Uttarakhand',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'gokarna',
    name: 'Gokarna',
    location: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
  },
];

const topAgencies: TravelAgency[] = [
  {
    id: 'mountain-trails',
    name: 'Mountain Trails',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 512,
    specialization: 'Adventure Experts',
    tripsCompleted: '1,250+ Trips',
    bgColor: 'bg-slate-900 text-white',
  },
  {
    id: 'northeast-explorer',
    name: 'North East Explorer',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 389,
    specialization: 'Northeast Expeditions',
    tripsCompleted: '1,890+ Trips',
    bgColor: 'bg-emerald-700 text-white',
  },
  {
    id: 'himalayan-escape',
    name: 'Himalayan Escape',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 440,
    specialization: 'Spiti & Leh Motorbike',
    tripsCompleted: '2,100+ Trips',
    bgColor: 'bg-amber-600 text-white',
  },
  {
    id: 'go-assam-tours',
    name: 'Go Assam Tours',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 290,
    specialization: 'Kaziranga Safaris',
    tripsCompleted: '1,420+ Trips',
    bgColor: 'bg-sky-600 text-white',
  },
];

const communityPicks: CommunityPick[] = [
  {
    id: 'cp-1',
    authorName: 'Ankita Sharma',
    authorHandle: '@ankitasharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isVerifiedTraveler: true,
    quote: '"Meghalaya is pure magic! The people, the food, the views — everything is just perfect."',
    visitedDestination: 'Meghalaya',
    agencyName: 'WanderIndia',
    rating: 5.0,
    likesCount: 342,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cp-2',
    authorName: 'Rohit Verma',
    authorHandle: '@rohitverma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    isVerifiedTraveler: true,
    quote: '"Ladakh - A Different World. Some places stay with you forever."',
    visitedDestination: 'Ladakh',
    rating: 5.0,
    likesCount: 980,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
];

const festivalItems: FestivalItem[] = [
  {
    id: 'hornbill',
    name: 'Hornbill Festival',
    date: '1–10 Dec, 2024',
    location: 'Nagaland',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'rannutsav',
    name: 'Rann Utsav',
    date: '1 Nov, 2024 – 28 Feb, 2025',
    location: 'Gujarat',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'zirofest',
    name: 'Ziro Festival',
    date: '26–29 Sep, 2024',
    location: 'Arunachal Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'goacarnival',
    name: 'Goa Carnival',
    date: '17 Feb, 2025',
    location: 'Goa',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
  },
];

const topExperiences = [
  {
    id: 'exp-1',
    title: 'Trekking',
    subtitle: 'Into the wild',
    icon: <Mountain className="w-5 h-5 text-white" />,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'exp-2',
    title: 'Photography',
    subtitle: 'Capture memories',
    icon: <Camera className="w-5 h-5 text-white" />,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
    iconBg: 'bg-sky-500',
  },
  {
    id: 'exp-3',
    title: 'Local Food',
    subtitle: 'Taste the culture',
    icon: <Utensils className="w-5 h-5 text-white" />,
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
    iconBg: 'bg-amber-500',
  },
  {
    id: 'exp-4',
    title: 'Camping',
    subtitle: 'Under the stars',
    icon: <Tent className="w-5 h-5 text-white" />,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
    iconBg: 'bg-purple-500',
  },
  {
    id: 'exp-5',
    title: 'Heritage',
    subtitle: 'Culture & history',
    icon: <Landmark className="w-5 h-5 text-white" />,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
    iconBg: 'bg-rose-500',
  },
];

const popularPackages: TravelPackage[] = [
  {
    id: 'pp-1',
    badge: 'Best Seller',
    title: 'Kashmir Paradise',
    price: '₹9,999',
    rating: 4.7,
    reviewsCount: 1200,
    duration: '5 Days / 4 Nights',
    location: 'Kashmir',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pp-2',
    badge: 'Popular',
    title: 'Bali Bliss',
    price: '₹22,999',
    rating: 4.6,
    reviewsCount: 832,
    duration: '4 Days / 3 Nights',
    location: 'Bali, Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pp-3',
    badge: 'New',
    title: 'Spiti Expedition',
    price: '₹13,999',
    rating: 4.8,
    reviewsCount: 612,
    duration: '6 Days / 5 Nights',
    location: 'Spiti Valley',
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
  },
];

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-28">
        {/* 2. Page Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Explore
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Discover places, people & experiences ✨
          </p>
        </motion.div>

        {/* 3. Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SearchBar
            placeholder="Search destinations, agencies, packages..."
            onSearch={(q) => setSearchQuery(q)}
            onFilterClick={() => alert('Filters coming soon!')}
          />
        </motion.div>

        {/* 4. Quick Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {filterOptions.map((option) => (
            <FilterChip
              key={option.id}
              option={option}
              isActive={activeFilter === option.id}
              onClick={(id) => setActiveFilter(id)}
            />
          ))}
        </motion.div>

        {/* 5. Section 1: Trending Right Now 🔥 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader
            title="Trending Right Now"
            emoji="🔥"
            onViewAll={() => {}}
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingDestinations.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/explore?dest=${dest.id}`)}
                className="relative w-64 sm:w-72 h-80 rounded-3xl overflow-hidden shadow-sm border border-slate-100/60 shrink-0 group cursor-pointer"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                {/* Trending Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FF4D6D] text-white text-[11px] font-bold shadow-sm">
                  Trending
                </div>

                {/* Bottom Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10 space-y-1 text-white">
                  <h4 className="text-xl font-extrabold tracking-tight drop-shadow-sm">
                    {dest.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {dest.rating} ({dest.reviewsCount})
                    </span>
                    <span className="font-extrabold text-rose-200">From {dest.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 6. Section 2: Explore by Mood */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Explore by Mood" onViewAll={() => {}} />

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-4">
            {moodItems.map((mood) => (
              <MoodCard key={mood.id} mood={mood} onClick={() => {}} />
            ))}
          </div>
        </motion.section>

        {/* 7. Section 3: Hidden Gems */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div>
            <SectionHeader title="Hidden Gems" onViewAll={() => {}} />
            <p className="text-xs font-medium text-slate-400 -mt-3 mb-3">
              Offbeat places worth exploring
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {hiddenGems.map((gem) => (
              <motion.div
                key={gem.id}
                whileHover={{ y: -3 }}
                className="w-52 sm:w-60 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all overflow-hidden shrink-0 cursor-pointer group"
              >
                <div className="w-full h-32 sm:h-36 overflow-hidden bg-slate-100">
                  <img
                    src={gem.imageUrl}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3.5 space-y-0.5">
                  <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">{gem.name}</h4>
                  <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF4D6D]" />
                    {gem.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 8. Section 4: Top Rated Travel Agencies ⭐ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Top Rated Travel Agencies" onViewAll={() => navigate('/agencies')} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {topAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} onViewAgency={() => navigate(`/agency/${agency.id}`)} />
            ))}
          </div>
        </motion.section>

        {/* 9. Section 5: Community Picks ❤️ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Community Picks" emoji="❤️" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {communityPicks.map((pick) => (
              <CommunityCard key={pick.id} pick={pick} onClick={() => {}} />
            ))}
          </div>
        </motion.section>

        {/* 10. Section 6: Upcoming Festivals & Events */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Upcoming Festivals & Events" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {festivalItems.map((fest) => (
              <FestivalCard key={fest.id} festival={fest} onClick={() => {}} />
            ))}
          </div>
        </motion.section>

        {/* 11. Section 7: Seasonal Picks for You */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div>
            <SectionHeader title="Seasonal Picks for You" onViewAll={() => {}} />
            <p className="text-xs font-medium text-slate-400 -mt-3 mb-3">
              Handpicked for this season
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monsoon Banner */}
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden shadow-xs border border-slate-100 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"
                alt="Monsoon Escapes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent p-6 flex flex-col justify-between text-white">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Monsoon Escapes 🌧️
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 font-medium max-w-xs">
                    Greenery, waterfalls & peaceful vibes
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-200">
                  <span>Explore Places</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Summer Banner */}
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden shadow-xs border border-slate-100 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop"
                alt="Summer Getaways"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent p-6 flex flex-col justify-between text-white">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Summer Getaways ☀️
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 font-medium max-w-xs">
                    Beaches, sunshine & good times
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-200">
                  <span>Explore Places</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 12. Section 8: Top Experiences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Top Experiences" onViewAll={() => {}} />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {topExperiences.map((exp) => (
              <motion.div
                key={exp.id}
                whileHover={{ y: -3 }}
                className="relative h-40 rounded-2xl overflow-hidden shadow-2xs border border-slate-100 group cursor-pointer"
              >
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-between text-white">
                  <div className={`w-8 h-8 rounded-xl ${exp.iconBg} flex items-center justify-center shadow-xs`}>
                    {exp.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold leading-tight">{exp.title}</h5>
                    <p className="text-[10px] text-white/80 font-medium">{exp.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 13. Section 9: Popular Packages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Popular Packages" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {popularPackages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        </motion.section>

        {/* 14. Section 10: Why Explore on ApnaTrip? (Dropdown FAQ Accordion) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <FaqAccordion title="Why Explore on ApnaTrip?" />
        </motion.section>
      </main>

      {/* 15. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default ExplorePage;
