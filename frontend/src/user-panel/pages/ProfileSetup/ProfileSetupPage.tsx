import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, Sparkles, Loader2, Globe, User as UserIcon, UtensilsCrossed, Accessibility } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { cloudinaryUploadService } from '../../../services/cloudinaryUpload.service';
import { userAuthService } from '../../services/userAuth.service';

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', icon: '👨' },
  { id: 'female', label: 'Female', icon: '👩' },
  { id: 'other', label: 'Other', icon: '🧑' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say', icon: '✨' },
] as const;

const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Bengali',
  'Spanish',
  'French',
  'German',
  'Gujarati',
  'Marathi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Punjabi',
  'Arabic',
  'Japanese',
  'Russian',
];

const FOOD_OPTIONS = [
  { id: 'All Cuisines', label: 'All Cuisines', icon: '🍽️' },
  { id: 'Local Street Food & Cafes', label: 'Street Food & Cafes', icon: '🍜' },
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗' },
  { id: 'Non-Veg', label: 'Non-Veg', icon: '🍗' },
  { id: 'Vegan', label: 'Vegan', icon: '🥑' },
  { id: 'Halal', label: 'Halal', icon: '🍖' },
  { id: 'Jain', label: 'Jain Food', icon: '🍲' },
];

const ACCESSIBILITY_CHIPS = [
  'Standard / None',
  'Wheelchair Accessible',
  'Ground Floor Rooms',
  'Elderly Friendly Pace',
  'Visual / Hearing Support',
];

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>(
    (user?.gender as any) || 'prefer_not_to_say'
  );
  const [preferredLanguage, setPreferredLanguage] = useState<string>(
    user?.preferredLanguage || 'English'
  );
  const [foodPreference, setFoodPreference] = useState<string>(
    user?.foodPreference || 'All Cuisines'
  );
  const [accessibilityRequirements, setAccessibilityRequirements] = useState<string>(
    user?.accessibilityRequirements || ''
  );
  const [tagline, setTagline] = useState('Passionate about mountain treks & hidden beaches');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Adventure', 'Solo Traveler']);
  const [loading, setLoading] = useState(false);

  const travelStyles = [
    'Backpacker',
    'Luxury Explorer',
    'Adventure',
    'Solo Traveler',
    'Family Trips',
    'Cultural',
    'Roadtripper',
    'Foodie Travel',
  ];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploadingPhoto) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await cloudinaryUploadService.uploadProfileAvatar(file);
      setAvatarUrl(res.avatarUrl);
      completeProfile({ avatar: res.avatarUrl });
      showToast('Profile photo uploaded to Cloudinary successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload profile photo to Cloudinary', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAuthService.updateProfile({
        bio: tagline,
        avatar: avatarUrl || undefined,
        gender,
        preferredLanguage,
        foodPreference,
        accessibilityRequirements,
      });
      completeProfile({
        bio: tagline,
        avatar: avatarUrl,
        gender,
        preferredLanguage,
        foodPreference,
        accessibilityRequirements,
      });
      showToast('Profile setup saved!', 'success');
      navigate('/travel-preferences');
    } catch (err: any) {
      // If offline or minor validation, still update local context
      completeProfile({
        bio: tagline,
        avatar: avatarUrl,
        gender,
        preferredLanguage,
        foodPreference,
        accessibilityRequirements,
      });
      navigate('/travel-preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await userAuthService.updateProfile({
        bio: tagline,
        avatar: avatarUrl || undefined,
        gender,
        preferredLanguage,
        foodPreference,
        accessibilityRequirements,
      });
    } catch (e) {
      // Ignore
    }
    completeProfile({
      bio: tagline,
      avatar: avatarUrl,
      gender,
      preferredLanguage,
      foodPreference,
      accessibilityRequirements,
    });
    navigate('/travel-preferences');
  };

  return (
    <AuthLayout
      heroTitle="Set up your traveler passport"
      heroSubtitle="Connect with like-minded travelers and discover tailored travel itineraries designed for your vibe."
    >
      <Header
        showBack={true}
        showProgress={true}
        currentStep={4}
        totalSteps={4}
        showSkip={true}
        skipText="Skip for now"
        onSkip={handleSkip}
      />

      <div className="w-full flex-1 flex flex-col justify-between p-6 md:p-8 max-w-md mx-auto z-10">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#FF4D6D] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Final Step</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Complete your profile
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Personalize your travel experience to get tailored recommendations.
            </p>
          </div>

          <form onSubmit={handleComplete} className="space-y-5">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Avatar Upload Container */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={handleAvatarClick}
                className="relative group cursor-pointer transition-transform hover:scale-105"
                title="Click to upload profile photo to Cloudinary"
              >
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-soft flex items-center justify-center overflow-hidden relative">
                  {uploadingPhoto ? (
                    <div className="w-full h-full bg-slate-900/60 flex items-center justify-center text-white">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white font-extrabold text-2xl">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AT'}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FF4D6D] text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {uploadingPhoto ? 'Uploading to Cloudinary...' : 'Upload profile photo'}
              </span>
            </div>

            {/* Travel Tagline */}
            <Input
              label="Travel Bio / Tagline"
              placeholder="e.g. Seeking hidden waterfalls & local street food"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Gender</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((opt) => {
                  const isSelected = gender === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGender(opt.id)}
                      className={`
                        px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none cursor-pointer border
                        ${
                          isSelected
                            ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-md shadow-[#FF4D6D]/20 scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span className="text-sm">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Preferred Language</span>
              </label>
              <div className="relative">
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#FF4D6D] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#0F172A] shadow-2xs transition-colors appearance-none cursor-pointer focus:outline-none"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Food & Dining Preference */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Food & Dining Preference</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {FOOD_OPTIONS.map((opt) => {
                  const isSelected = foodPreference === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFoodPreference(opt.id)}
                      className={`
                        px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer border
                        ${
                          isSelected
                            ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-md shadow-[#FF4D6D]/20 scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessibility & Special Assistance */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <Accessibility className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Accessibility / Special Needs</span>
                <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ACCESSIBILITY_CHIPS.map((chip) => {
                  const isSelected =
                    accessibilityRequirements === chip ||
                    (chip === 'Standard / None' && !accessibilityRequirements);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() =>
                        setAccessibilityRequirements(chip === 'Standard / None' ? '' : chip)
                      }
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none cursor-pointer border
                        ${
                          isSelected
                            ? 'bg-rose-50 text-[#FF4D6D] border-[#FF4D6D] font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }
                      `}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={accessibilityRequirements}
                onChange={(e) => setAccessibilityRequirements(e.target.value)}
                placeholder="Or specify any dietary allergies / medical assistance..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D6D] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 shadow-2xs transition-all focus:outline-none"
              />
            </div>

            {/* Select Travel Style Chips */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Select your Travel Vibe (Choose 2 or more)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {travelStyles.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer
                        ${
                          isSelected
                            ? 'bg-[#FF4D6D] text-white shadow-coral scale-105'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{style}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" loading={loading} showArrow className="mt-4">
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ProfileSetupPage;

