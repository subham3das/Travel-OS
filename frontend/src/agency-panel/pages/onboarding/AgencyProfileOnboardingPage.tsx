import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  X,
  Camera,
  Info,
  UserCheck,
  Building,
  Briefcase,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Search,
  Plus,
  Check,
  Compass,
  Heart,
  Users,
  Award,
  Shield,
  Smile,
  Sparkles,
} from 'lucide-react';
import { OnboardingStepper } from '../../components/OnboardingStepper';

const STORAGE_KEY = 'apnatrip_agency_onboarding_profile';
const BUSINESS_STORAGE_KEY = 'apnatrip_agency_onboarding_business';

export interface ServicesOption {
  id: string;
  label: string;
  iconName: string;
}

export const SERVICES_LIST: ServicesOption[] = [
  { id: 'domestic', label: 'Domestic Tours', iconName: 'Compass' },
  { id: 'international', label: 'International Tours', iconName: 'Globe' },
  { id: 'adventure', label: 'Adventure', iconName: 'Sparkles' },
  { id: 'trekking', label: 'Trekking', iconName: 'Award' },
  { id: 'honeymoon', label: 'Honeymoon', iconName: 'Heart' },
  { id: 'family', label: 'Family Tours', iconName: 'Users' },
  { id: 'luxury', label: 'Luxury Travel', iconName: 'Shield' },
  { id: 'corporate', label: 'Corporate Travel', iconName: 'Briefcase' },
  { id: 'pilgrimage', label: 'Pilgrimage', iconName: 'Building' },
  { id: 'wildlife', label: 'Wildlife', iconName: 'Smile' },
  { id: 'roadtrips', label: 'Road Trips', iconName: 'Compass' },
  { id: 'bike', label: 'Bike Expeditions', iconName: 'Sparkles' },
  { id: 'cruises', label: 'Cruises', iconName: 'Globe' },
  { id: 'student', label: 'Student Tours', iconName: 'Users' },
  { id: 'others', label: 'Others', iconName: 'Plus' },
];

export const POPULAR_DESTINATIONS = [
  'Ladakh',
  'Meghalaya',
  'Sikkim',
  'Kashmir',
  'Goa',
  'Spiti',
  'Andaman & Nicobar',
  'Rajasthan',
  'Kerala',
  'Himachal Pradesh',
  'Uttarakhand',
  'Bali',
  'Thailand',
  'Dubai',
];

export const LANGUAGES_LIST = [
  'English',
  'Hindi',
  'Bengali',
  'Assamese',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Others',
];

export const TEAM_SIZES = [
  '1–5 members',
  '6–10 members',
  '11–25 members',
  '26–50 members',
  '51–100 members',
  '100+ members',
];

export interface ProfileFormData {
  logoUrl: string;
  coverUrl: string;
  tagline: string;
  about: string;
  yearsOfExperience: string;
  teamSize: string;
  selectedServices: string[];
  destinations: string[];
  languages: string[];
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
}

const initialProfileData: ProfileFormData = {
  logoUrl: '',
  coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
  tagline: '',
  about: '',
  yearsOfExperience: '',
  teamSize: '',
  selectedServices: ['domestic', 'international', 'honeymoon', 'family'],
  destinations: ['Ladakh', 'Meghalaya', 'Sikkim', 'Kashmir', 'Goa', 'Andaman & Nicobar'],
  languages: ['English', 'Hindi', 'Bengali', 'Assamese'],
  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
};

export const AgencyProfileOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return initialProfileData;
  });

  const [destSearch, setDestSearch] = useState('');
  const [showAddDestModal, setShowAddDestModal] = useState(false);

  // Calculate Years of Experience from Step 1 establishment year
  useEffect(() => {
    try {
      const savedBusiness = localStorage.getItem(BUSINESS_STORAGE_KEY);
      if (savedBusiness) {
        const bizData = JSON.parse(savedBusiness);
        if (bizData.yearEstablished && !formData.yearsOfExperience) {
          const estabYear = parseInt(bizData.yearEstablished, 10);
          const currentYear = new Date().getFullYear();
          if (!isNaN(estabYear) && estabYear <= currentYear) {
            const exp = currentYear - estabYear;
            const expStr = exp === 0 ? 'Less than 1 Year' : `${exp} Year${exp > 1 ? 's' : ''}`;
            setFormData((prev) => ({ ...prev, yearsOfExperience: expStr }));
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  // Image Upload Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Cover image size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Services
  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(serviceId);
      const updated = exists
        ? prev.selectedServices.filter((s) => s !== serviceId)
        : [...prev.selectedServices, serviceId];
      return { ...prev, selectedServices: updated };
    });
  };

  // Toggle Destinations
  const removeDestination = (dest: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((d) => d !== dest),
    }));
  };

  const addDestination = (dest: string) => {
    if (!formData.destinations.includes(dest)) {
      setFormData((prev) => ({
        ...prev,
        destinations: [...prev.destinations, dest],
      }));
    }
  };

  // Toggle Languages
  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      const updated = exists
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: updated };
    });
  };

  // Form Validation
  const isLogoValid = formData.logoUrl.length > 0;
  const isCoverValid = formData.coverUrl.length > 0;
  const isTaglineValid = formData.tagline.trim().length > 0 && formData.tagline.length <= 100;
  const isAboutValid = formData.about.trim().length > 0 && formData.about.length <= 500;
  const isPhoneValid = formData.phone.trim().length >= 7;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isServicesValid = formData.selectedServices.length > 0;
  const isDestinationsValid = formData.destinations.length > 0;
  const isLanguagesValid = formData.languages.length > 0;

  const isFormValid =
    isLogoValid &&
    isCoverValid &&
    isTaglineValid &&
    isAboutValid &&
    isPhoneValid &&
    isEmailValid &&
    isServicesValid &&
    isDestinationsValid &&
    isLanguagesValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/agency/onboarding/verification');
    }
  };

  // Filtered destination suggestions for search input
  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      !formData.destinations.includes(d) &&
      d.toLowerCase().includes(destSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col font-sans select-none">
      {/* ── Top Header with Brand Logo ── */}
      <header className="py-4 px-6 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Apna<span className="text-[#583BE8]">Trip</span>
          </span>
        </div>
      </header>

      {/* ── Progress Stepper ── */}
      <div className="pt-4 pb-2 bg-white border-b border-slate-100">
        <OnboardingStepper currentStep={2} />
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Header with ID Card Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Create Your Agency Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              This information will be visible to travelers.
            </p>
          </div>

          {/* Profile Card Vector Illustration */}
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 relative hidden xs:flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
              <rect x="15" y="20" width="110" height="70" rx="8" fill="#EDE8FF" />
              <rect x="25" y="32" width="24" height="24" rx="12" fill="#583BE8" />
              <rect x="55" y="34" width="55" height="8" rx="2" fill="#583BE8" />
              <rect x="55" y="48" width="40" height="5" rx="2" fill="#B4A4FF" />
              <rect x="55" y="58" width="50" height="5" rx="2" fill="#CBD5E1" />
              <circle cx="115" cy="72" r="8" fill="#8C75FF" />
            </svg>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── SECTION 1: Branding ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">1. Branding</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Agency Logo Upload */}
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Agency Logo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />

                  {formData.logoUrl ? (
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#583BE8] p-1 bg-white shadow-md group overflow-hidden flex items-center justify-center">
                      <img
                        src={formData.logoUrl}
                        alt="Agency Logo Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-full">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="p-1.5 rounded-full bg-white text-[#583BE8] hover:bg-purple-50 cursor-pointer"
                          title="Replace Logo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                          className="p-1.5 rounded-full bg-white text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Remove Logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 hover:border-[#583BE8] transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#583BE8]">Upload Logo</span>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5">PNG, JPG (Max 2MB)</span>
                    </div>
                  )}
                </div>

                {/* Cover Photo Upload */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Cover Photo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />

                  {formData.coverUrl ? (
                    <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                      <img
                        src={formData.coverUrl}
                        alt="Agency Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-3">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#0F172A] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#583BE8]" />
                          <span>Change Cover</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, coverUrl: '' }))}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Remove Cover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full h-36 sm:h-40 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 hover:border-[#583BE8] transition-all flex flex-col items-center justify-center text-center p-4 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#583BE8]">Upload Cover Photo</span>
                      <span className="text-[11px] font-medium text-slate-400 mt-0.5">PNG, JPG (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Helper note */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pt-1">
                <Info className="w-4 h-4 text-[#583BE8] shrink-0" />
                <span>A logo and cover photo help build trust with travelers.</span>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 2: About Your Agency ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">2. About Your Agency</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Agency Tagline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Agency Tagline <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {formData.tagline.length} / 100
                  </span>
                </div>
                <input
                  type="text"
                  name="tagline"
                  maxLength={100}
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Crafting memorable journeys"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                />
              </div>

              {/* About Agency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    About Agency <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {formData.about.length} / 500
                  </span>
                </div>
                <textarea
                  name="about"
                  rows={4}
                  maxLength={500}
                  value={formData.about}
                  onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
                  placeholder="Tell travelers about your agency, your experience and what makes you special..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Years of Experience & Team Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Years of Experience</label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Select experience</option>
                    <option value="Less than 1 Year">Less than 1 Year</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5-10 Years">5-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                  <span className="text-[10px] font-medium text-slate-400 block px-1">
                    Auto-filled from establishment year
                  </span>
                </div>

                {/* Team Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Team Size <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teamSize: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">e.g. 10-25 members</option>
                    {TEAM_SIZES.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 3: Services Offered ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">3. Services Offered</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">Select all that apply</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-wrap gap-2.5">
                {SERVICES_LIST.map((srv) => {
                  const isSelected = formData.selectedServices.includes(srv.id);
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 border-[#583BE8] text-[#583BE8] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className="text-sm">✦</span>
                      <span>{srv.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 4: Destinations Covered ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">4. Destinations Covered</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">Select destinations you specialize in</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder="Search destinations"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                />
              </div>

              {/* Filtered suggestions list dropdown if searching */}
              {destSearch.trim().length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-md max-h-40 overflow-y-auto space-y-1">
                  {filteredDestinations.length > 0 ? (
                    filteredDestinations.map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          addDestination(d);
                          setDestSearch('');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <span>{d}</span>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center text-xs text-slate-400">
                      No matching destinations. Press Add below.
                    </div>
                  )}
                </div>
              )}

              {/* Selected Destination Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.destinations.map((d) => (
                  <span
                    key={d}
                    className="px-3.5 py-1.5 rounded-2xl bg-purple-50 border border-purple-100 text-[#583BE8] font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => removeDestination(d)}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add More Destinations Button */}
              <button
                type="button"
                onClick={() => setShowAddDestModal(!showAddDestModal)}
                className="text-xs font-bold text-[#583BE8] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Destinations</span>
              </button>

              {/* Popular destinations tray when clicked */}
              {showAddDestModal && (
                <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100">
                  {POPULAR_DESTINATIONS.filter((d) => !formData.destinations.includes(d)).map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => addDestination(d)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#583BE8] font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── SECTION 5: Languages Spoken ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A]">5. Languages Spoken</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">Select all that apply</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-wrap gap-2.5">
                {LANGUAGES_LIST.map((lang) => {
                  const isSelected = formData.languages.includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#583BE8] text-white shadow-sm shadow-[#583BE8]/20'
                          : 'bg-white border border-purple-200/80 text-[#583BE8] hover:bg-purple-50/50'
                      }`}
                    >
                      <span>{lang}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 6: Contact Information ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">6. Contact Information</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Business Phone */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Business Phone *"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Business Email */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Business Email *"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="Website (Optional)"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                    placeholder="Instagram (Optional)"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Facebook className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
                    placeholder="Facebook (Optional)"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </main>

      {/* ── Fixed Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 shadow-lg">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/agency/onboarding/business')}
            className="w-1/2 py-3.5 px-6 rounded-2xl bg-white border border-[#583BE8]/30 hover:border-[#583BE8] active:scale-[0.99] text-[#583BE8] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>

          {/* Continue Button */}
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isFormValid
                ? 'bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white shadow-[#583BE8]/25 cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed opacity-70'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfileOnboardingPage;
