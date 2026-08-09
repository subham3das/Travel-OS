import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  Play,
  Eye,
  UserPlus,
  Bike,
  Mountain,
  Grid,
  Plus,
} from 'lucide-react';
import { getCommunityPosts } from '../../data/posts';

import { AppHeader } from '../../components/home/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CommunityTabs } from '../../components/community/CommunityTabs';
import { CreatePostCard } from '../../components/community/CreatePostCard';
import { TravelerPost, PostData } from '../../components/community/TravelerPost';
import { TravelCircleCard, TravelCircle } from '../../components/community/TravelCircleCard';
import { QuestionCard, CommunityQuestion } from '../../components/community/QuestionCard';
import { GroupTripCard, GroupTrip } from '../../components/community/GroupTripCard';
import { PassportCard } from '../../components/community/PassportCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';

// Sample Mock Data matching comunity.png & community extenteds.png
const samplePost: PostData = {
  id: 'post-1',
  authorName: 'Ananya Sharma',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  isVerified: true,
  timeAgo: '2h ago',
  location: 'Spiti Valley',
  imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
  slideCount: '1/8',
  caption:
    'Today I finally reached Chandratal Lake after an amazing trek through the mountains! The view was absolutely unreal. Nature at its best! 🏔️💙',
  likesCount: 254,
  commentsCount: 41,
  sharesCount: 18,
  agencyName: 'Himalayan Trekkers',
  agencyVerified: true,
};

const storyItems = [
  {
    id: 'st-1',
    title: '7 Days in Ladakh',
    author: 'Rohit Verma',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-2',
    title: 'Meghalaya Diaries',
    author: 'Neha Iyer',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-3',
    title: 'Solo in Vietnam',
    author: 'Karan Malhotra',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-4',
    title: 'Sunrise in Spiti',
    author: 'Aarav Jain',
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
  },
];

const circleItems: TravelCircle[] = [
  {
    id: 'solo',
    title: 'Solo',
    membersCount: '12.4K',
    icon: <Compass className="w-5 h-5" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'backpackers',
    title: 'Backpackers',
    membersCount: '18.7K',
    icon: <Compass className="w-5 h-5" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'women',
    title: 'Women',
    membersCount: '9.3K',
    icon: <Users className="w-5 h-5" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
  {
    id: 'bikeriders',
    title: 'Bike Riders',
    membersCount: '7.8K',
    icon: <Bike className="w-5 h-5" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'trekkers',
    title: 'Trekkers',
    membersCount: '15.2K',
    icon: <Mountain className="w-5 h-5" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'more',
    title: 'More',
    membersCount: '',
    icon: <Grid className="w-5 h-5" />,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

const questionItems: CommunityQuestion[] = [
  {
    id: 'q-1',
    authorName: 'Rohit Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    timeAgo: '3h ago',
    question: 'Best time to visit Vietnam?',
    answersCount: 24,
  },
  {
    id: 'q-2',
    authorName: 'Neha Iyer',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    timeAgo: '5h ago',
    question: 'How to plan a budget trip to Ladakh?',
    answersCount: 18,
  },
  {
    id: 'q-3',
    authorName: 'Karan Malhotra',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    timeAgo: '7h ago',
    question: 'Solo trip to Spiti Valley – Need Tips',
    answersCount: 31,
  },
];

const groupTripsData: GroupTrip[] = [
  {
    id: 'gt-1',
    title: 'Trek to Kedarkantha',
    status: 'Open',
    dates: '12 – 16 May, 2024',
    location: 'Uttarakhand',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    participants: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    ],
    extraParticipantsCount: 8,
    spotsLeft: '12 spots left',
  },
  {
    id: 'gt-2',
    title: 'Goa Beach Escape',
    status: 'Upcoming',
    dates: '24 – 27 May, 2024',
    location: 'Goa',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
    participants: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    ],
    extraParticipantsCount: 12,
    spotsLeft: '18 spots left',
  },
];

const recentStoriesData = [
  {
    id: 'rs-1',
    authorHandle: '@ankitasharma',
    timeAgo: '2h ago',
    location: 'Tawang',
    viewsCount: '1.2K',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'rs-2',
    authorHandle: '@rohitverma',
    timeAgo: '4h ago',
    location: 'Ladakh',
    viewsCount: '980',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'rs-3',
    authorHandle: '@neha.iyer',
    timeAgo: '6h ago',
    location: 'Bali',
    viewsCount: '1.5K',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'rs-4',
    authorHandle: '@traveller_sid',
    timeAgo: '8h ago',
    location: 'Sikkim',
    viewsCount: '790',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600&auto=format&fit=crop',
  },
];

const suggestedPeople = [
  {
    id: 'sp-1',
    name: 'Priya Singh',
    mutualFriends: '12 mutual friends',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'sp-2',
    name: 'Arjun Das',
    mutualFriends: '8 mutual friends',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'sp-3',
    name: 'Manav Sharma',
    mutualFriends: '10 mutual friends',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
];

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('for-you');

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
            Community
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Connect. Share. Inspire. Explore together ✨
          </p>
        </motion.div>

        {/* 3. Community Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <CommunityTabs activeTab={activeTab} onTabChange={(id) => setActiveTab(id)} />
        </motion.div>

        {/* 5. Create Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <CreatePostCard />
        </motion.div>

        {/* Dynamic Community Posts */}
        {getCommunityPosts().map((dynPost) => (
          <TravelerPost
            key={dynPost.id}
            post={{
              id: dynPost.id,
              authorName: dynPost.userName,
              authorAvatar: dynPost.userAvatar,
              isVerified: true,
              timeAgo: dynPost.createdAt,
              location: dynPost.destinationName || 'Himalayan Trails',
              imageUrl: dynPost.images[0] || samplePost.imageUrl,
              slideCount: dynPost.images.length > 1 ? `1/${dynPost.images.length}` : undefined,
              caption: dynPost.caption,
              likesCount: dynPost.likes,
              commentsCount: dynPost.comments,
              sharesCount: 12,
              agencyName: dynPost.agencyName,
              agencyVerified: true,
            }}
            onAgencyClick={() => navigate('/agency/agency-001')}
          />
        ))}

        {/* 7. Section: Stories You Might Like 🔥 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Stories You Might Like" emoji="🔥" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {storyItems.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -3 }}
                className="relative w-56 sm:w-64 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xs border border-slate-100/60 shrink-0 cursor-pointer group"
              >
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Story Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h5 className="text-sm font-bold tracking-tight truncate drop-shadow-xs">
                    {story.title}
                  </h5>
                  <p className="text-[11px] font-medium text-white/80 leading-none">
                    {story.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 8. Section: Popular Travel Circles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Popular Travel Circles" onViewAll={() => {}} />

          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {circleItems.map((circle) => (
              <TravelCircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        </motion.section>

        {/* 9. Section: Ask the Community */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Ask the Community" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {questionItems.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </motion.section>

        {/* 10. Section: Upcoming Group Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Upcoming Group Trips" onViewAll={() => {}} />

          <div className="space-y-3">
            {groupTripsData.map((trip) => (
              <GroupTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </motion.section>

        {/* 11. Section: Traveler Passport */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Traveler Passport" onViewAll={() => {}} />
          <PassportCard />
        </motion.section>

        {/* 12. Section: Recent Stories Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Recent Stories" onViewAll={() => {}} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {recentStoriesData.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -3 }}
                className="relative h-44 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group cursor-pointer"
              >
                <img
                  src={story.imageUrl}
                  alt={story.location}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between text-white">
                  <div className="text-[11px] font-bold tracking-tight">
                    {story.authorHandle}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-white/90">
                    <span>{story.location}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {story.viewsCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 13. Section: People You May Know */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="People You May Know" onViewAll={() => {}} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {suggestedPeople.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A] tracking-tight">{person.name}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{person.mutualFriends}</p>
                  </div>
                </div>

                <button className="px-3 py-1 rounded-full bg-rose-50 hover:bg-[#FF4D6D] text-[#FF4D6D] hover:text-white border border-rose-200 text-xs font-bold transition-all focus:outline-none flex items-center gap-1 shrink-0">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* 14. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="community" />
    </div>
  );
};

export default CommunityPage;
