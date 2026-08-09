import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Compass,
  CheckCircle2,
  Bookmark,
  FileText,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { StatCard, StatItem } from '../../components/trips/StatCard';
import { UpcomingTripCard, UpcomingTrip } from '../../components/trips/UpcomingTripCard';
import { JourneyCard, OngoingJourney } from '../../components/trips/JourneyCard';
import { QuickActionGrid } from '../../components/trips/QuickActionCard';
import { PastTripCard, PastTrip } from '../../components/trips/PastTripCard';
import { SavedTripCard, SavedTrip } from '../../components/trips/SavedTripCard';
import { BookingCardGrid } from '../../components/trips/BookingCard';
import { DocumentCardGrid } from '../../components/trips/DocumentCard';
import { WriteStoryCard } from '../../components/trips/WriteStoryCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';

// Sample Mock Data matching my trips.png
const statsData: StatItem[] = [
  {
    id: 'upcoming',
    label: 'Upcoming',
    count: 2,
    icon: <Calendar className="w-5 h-5" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
  {
    id: 'ongoing',
    label: 'Ongoing',
    count: 1,
    icon: <Compass className="w-5 h-5" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'completed',
    label: 'Completed',
    count: 8,
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'saved',
    label: 'Saved',
    count: 5,
    icon: <Bookmark className="w-5 h-5" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const upcomingTripData: UpcomingTrip = {
  id: 'ut-1',
  title: 'Meghalaya Adventure',
  dates: '12 – 16 Sept, 2024',
  duration: '5 Days',
  locations: 'Shillong, Cherrapunji, Dawki',
  status: 'Confirmed',
  imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  companions: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  ],
  extraCompanionsCount: 2,
};

const ongoingJourneyData: OngoingJourney = {
  id: 'oj-1',
  title: 'Spiti Valley',
  currentDay: 'Day 2 of 5',
  date: '14 Sept, 2024',
  locations: 'Kaza, Hikkim, Langza',
  imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
};

const pastTripsData: PastTrip[] = [
  {
    id: 'pt-1',
    title: 'Manali Escape',
    date: 'May 2024',
    duration: '4 Days',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    isWishlisted: true,
  },
  {
    id: 'pt-2',
    title: 'Goa Getaway',
    date: 'Jan 2024',
    duration: '5 Days',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
    isWishlisted: true,
  },
  {
    id: 'pt-3',
    title: 'Bali Bliss',
    date: 'Oct 2023',
    duration: '6 Days',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
    isWishlisted: true,
  },
  {
    id: 'pt-4',
    title: 'Ladakh Road Trip',
    date: 'Aug 2023',
    duration: '6 Days',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
    isWishlisted: false,
  },
];

const savedTripsData: SavedTrip[] = [
  {
    id: 'st-1',
    title: 'Kashmir',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-2',
    title: 'Iceland',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-3',
    title: 'Vietnam',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'st-4',
    title: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
  },
];

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();

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
            My Trips
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Manage your journeys, memories & more ✨
          </p>
        </motion.div>

        {/* 3. Quick Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </motion.div>

        {/* 4. Section 1: Upcoming Trip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Upcoming Trip" onViewAll={() => {}} />
          <UpcomingTripCard
            trip={upcomingTripData}
            onViewTrip={(trip) => navigate(`/trips/${trip.id || 'trip-001'}`)}
          />
        </motion.section>

        {/* 5. Section 2: Quick Access */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Quick Access" />
          <QuickActionGrid onActionClick={(act) => alert(`Opened ${act.title}`)} />
        </motion.section>

        {/* 6. Section 3: Ongoing Trip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Ongoing Trip" />

          {/* Highlighted Travel Documents Ready Card */}
          <div className="bg-gradient-to-r from-[#F4F0FF] via-[#F8F5FF] to-[#FAF8FF] rounded-3xl p-4 sm:p-5 border border-[#E2D8FF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#0F172A]">📄 Travel Documents Ready</h4>
                <p className="text-xs font-semibold text-slate-500">Your booking vouchers and travel documents are available.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/trips/trip-001/documents')}
              className="px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 cursor-pointer transition-all shrink-0 text-center"
            >
              Open Documents
            </button>
          </div>

          <JourneyCard
            journey={ongoingJourneyData}
            onActionClick={(action) => alert(`Action: ${action}`)}
          />
        </motion.section>

        {/* 7. Section 4: Past Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Past Trips" onViewAll={() => {}} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {pastTripsData.map((trip) => (
              <PastTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </motion.section>

        {/* 8. Section 5: Saved Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Saved Trips" onViewAll={() => navigate('/explore')} />

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {savedTripsData.map((trip) => (
              <SavedTripCard key={trip.id} trip={trip} onClick={() => navigate('/explore')} />
            ))}
          </div>
        </motion.section>

        {/* 9. Section 6: Booking History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Booking History" onViewAll={() => {}} />
          <BookingCardGrid onCategoryClick={(cat) => alert(`Booking history for ${cat.title}`)} />
        </motion.section>

        {/* 10. Section 7: Trip Documents */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="Trip Documents" onViewAll={() => {}} />
          <DocumentCardGrid onCategoryClick={(doc) => alert(`Opened ${doc.title}`)} />
        </motion.section>

        {/* 11. Section 8: Write Your Story CTA Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <WriteStoryCard />
        </motion.section>
      </main>

      {/* 12. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="trips" />
    </div>
  );
};

export default MyTripsPage;
