import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { PreferenceStyleCard, StyleOption } from '../../components/preferences/PreferenceStyleCard';
import { PreferenceToggleCard } from '../../components/preferences/PreferenceToggleCard';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';

const travelStyles: StyleOption[] = [
  { id: 'backpacking', label: 'Backpacking', icon: '🎒' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'camping', label: 'Camping', icon: '🏕️' },
  { id: 'spiritual', label: 'Spiritual', icon: '🛕' },
  { id: 'heritage', label: 'Heritage', icon: '🏛️' },
  { id: 'city-break', label: 'City Break', icon: '🏙️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'road-trip', label: 'Road Trip', icon: '🚗' },
];

const companionsOptions = ['Solo', 'Friends', 'Family', 'Partner', 'Groups'];

const favoriteDestinationsList = [
  'Ladakh',
  'Meghalaya',
  'Goa',
  'Kerala',
  'Kashmir',
  'Andaman',
  'Sikkim',
  'Spiti',
  'Bali',
  'Vietnam',
  'Japan',
  'Thailand',
];

const activitiesList = [
  'Trekking',
  'Camping',
  'Food',
  'Wildlife',
  'Photography',
  'Shopping',
  'Boating',
  'Scuba',
  'Surfing',
  'Snow',
  'Temples',
  'Museums',
  'Festivals',
  'Road Trips',
  'Nightlife',
];

export const TravelPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { completePreferences } = useAuth();

  // Selected States
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['adventure', 'nature', 'road-trip']);
  const [selectedCompanion, setSelectedCompanion] = useState<string>('Solo');
  const [budget, setBudget] = useState<number>(35000);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['Meghalaya', 'Spiti', 'Ladakh']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Trekking', 'Photography', 'Food']);
  const [dreamDestination, setDreamDestination] = useState<string>('');

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    deals: true,
    festivals: true,
    nearby: false,
    community: true,
    priceDrops: true,
    agencyOffers: false,
  });

  // Privacy Toggles
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    allowFollow: true,
    receiveInvites: true,
  });

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleContinue = async () => {
    setIsSubmitting(true);
    const budgetCategory = budget <= 20000 ? 'Budget' : budget <= 60000 ? 'Mid Range' : 'Luxury';

    try {
      await userAuthService.updateTravelPreferences({
        travelInterests: [...selectedDestinations, ...selectedActivities],
        travelStyle: selectedStyles,
        budgetPreference: budgetCategory,
        preferredTripDuration: ['3-5 Days', '1-2 Weeks'],
        preferredTransportation: ['Flight', 'Train', 'Road Trip'],
        foodPreference: selectedActivities.includes('Food') ? 'Local Street Food & Cafes' : 'All Cuisines',
      });

      await userAuthService.updateNotificationPreferences({
        pushNotifications: notifications.deals,
        emailNotifications: notifications.festivals,
        bookingUpdates: true,
        tripReminders: true,
        travelRecommendations: notifications.nearby,
        offersAndDiscounts: notifications.priceDrops,
        communityActivity: notifications.community,
        marketingEmails: notifications.agencyOffers,
      });

      await userAuthService.updatePrivacyPreferences({
        publicProfile: privacy.showProfile,
        allowFollowers: privacy.allowFollow,
        allowMessages: privacy.receiveInvites,
      });

      showToast('Travel preferences saved!', 'success');
      completePreferences();
      navigate('/welcome');
    } catch (err: any) {
      completePreferences();
      navigate('/welcome');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    completePreferences();
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#0F172A] focus:outline-none"
        >
          <svg className="w-6 h-6 text-[#FF4D6D] fill-current" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          <span className="text-xl font-black tracking-tight">ApnaTrip</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#FF4D6D] text-xs font-bold">
          <span>Step 2 of 2</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs sm:text-sm font-bold text-[#FF4D6D] hover:underline focus:outline-none"
        >
          Skip
        </button>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 sm:space-y-10 pb-20">
        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1 text-center sm:text-left"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Choose Your Travel Preferences
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Help us personalize your travel experience. You can change these anytime later.
          </p>
        </motion.div>

        {/* Section 1: Travel Style */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Travel Style <span className="text-xs font-semibold text-slate-400">(Select multiple)</span>
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {travelStyles.map((style) => (
              <PreferenceStyleCard
                key={style.id}
                option={style}
                isSelected={selectedStyles.includes(style.id)}
                onToggle={toggleStyle}
              />
            ))}
          </div>
        </motion.section>

        {/* Section 2: Who do you usually travel with? */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Who do you usually travel with?
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {companionsOptions.map((comp) => {
              const isSelected = selectedCompanion === comp;
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setSelectedCompanion(comp)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20'
                      : 'bg-white text-slate-700 border border-slate-100 hover:border-slate-200 shadow-2xs'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Section 3: Preferred Budget */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
              Preferred Budget
            </h3>
            <span className="text-sm sm:text-base font-extrabold text-[#FF4D6D] px-3 py-1 rounded-full bg-rose-50">
              ₹{budget.toLocaleString('en-IN')} / trip
            </span>
          </div>

          <input
            type="range"
            min={5000}
            max={200000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FF4D6D]"
          />

          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>₹5K (Budget)</span>
            <span>₹50K (Comfort)</span>
            <span>₹2L+ (Luxury)</span>
          </div>
        </motion.section>

        {/* Section 4: Favorite Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Favorite Destinations
          </h3>

          <div className="flex flex-wrap gap-2">
            {favoriteDestinationsList.map((dest) => {
              const isSelected = selectedDestinations.includes(dest);
              return (
                <button
                  key={dest}
                  type="button"
                  onClick={() => toggleDestination(dest)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF4D6D] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-100 hover:border-slate-200 shadow-2xs'
                  }`}
                >
                  {dest} {isSelected ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Section 5: Activities You Love */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Activities You Love
          </h3>

          <div className="flex flex-wrap gap-2">
            {activitiesList.map((act) => {
              const isSelected = selectedActivities.includes(act);
              return (
                <button
                  key={act}
                  type="button"
                  onClick={() => toggleActivity(act)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF4D6D] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-100 hover:border-slate-200 shadow-2xs'
                  }`}
                >
                  {act} {isSelected ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Section 6: Dream Destination */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Dream Destination
          </h3>

          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dreamDestination}
              onChange={(e) => setDreamDestination(e.target.value)}
              placeholder="Search your dream destination... (e.g. Switzerland, Iceland)"
              className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 shadow-2xs focus:outline-none focus:border-[#FF4D6D]/40"
            />
          </div>
        </motion.section>

        {/* Section 7: Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Notification Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PreferenceToggleCard
              id="deals"
              title="Travel Deals"
              subtitle="Get special package discounts"
              enabled={notifications.deals}
              onToggle={() => setNotifications((p) => ({ ...p, deals: !p.deals }))}
            />
            <PreferenceToggleCard
              id="festivals"
              title="Festival Alerts"
              subtitle="Upcoming cultural events"
              enabled={notifications.festivals}
              onToggle={() => setNotifications((p) => ({ ...p, festivals: !p.festivals }))}
            />
            <PreferenceToggleCard
              id="nearby"
              title="Nearby Trips"
              subtitle="Activities near your location"
              enabled={notifications.nearby}
              onToggle={() => setNotifications((p) => ({ ...p, nearby: !p.nearby }))}
            />
            <PreferenceToggleCard
              id="community"
              title="Community Updates"
              subtitle="New story posts & replies"
              enabled={notifications.community}
              onToggle={() => setNotifications((p) => ({ ...p, community: !p.community }))}
            />
          </div>
        </motion.section>

        {/* Section 8: Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="space-y-3"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
            Privacy Settings
          </h3>

          <div className="space-y-3">
            <PreferenceToggleCard
              id="showProfile"
              title="Show my profile in Community"
              enabled={privacy.showProfile}
              onToggle={() => setPrivacy((p) => ({ ...p, showProfile: !p.showProfile }))}
            />
            <PreferenceToggleCard
              id="allowFollow"
              title="Allow travelers to follow me"
              enabled={privacy.allowFollow}
              onToggle={() => setPrivacy((p) => ({ ...p, allowFollow: !p.allowFollow }))}
            />
            <PreferenceToggleCard
              id="receiveInvites"
              title="Receive travel group invitations"
              enabled={privacy.receiveInvites}
              onToggle={() => setPrivacy((p) => ({ ...p, receiveInvites: !p.receiveInvites }))}
            />
          </div>
        </motion.section>

        {/* Bottom Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="space-y-3 pt-4 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white font-extrabold text-base shadow-lg shadow-[#FF4D6D]/20 transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Saving Preferences...' : 'Continue'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
          >
            Skip for now
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default TravelPreferencesPage;
