import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { OnboardingCard } from '../../components/auth/OnboardingCard';
import { Logo } from '../../components/common/Logo';
import onboardingBg from '../../../assets/onbording_background.jpg';

interface SlideConfig {
  badge: string;
  title: string;
  subtitle: string;
  heroImage: string;
}

const DESKTOP_SLIDES: SlideConfig[] = [
  {
    badge: '#1 Travel & Vehicle Rental Platform',
    title: 'Discover, Connect, and Travel with ApnaTrip',
    subtitle:
      "Your ultimate travel companion for exploring world's best places, booking trusted rides, and joining vibrant traveler communities.",
    heroImage: onboardingBg,
  },
  {
    badge: 'Curated Destinations & Hidden Gems',
    title: 'Discover Amazing Destinations & Trips',
    subtitle:
      'Find handpicked places to visit, curated itineraries, and authentic recommendations shared by verified global travelers.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200',
  },
  {
    badge: 'Verified Rides & Fleets',
    title: 'Reliable Rides & Self-Drive Rentals',
    subtitle:
      'Book verified chauffeurs or drive yourself with transparent pricing, sanitized vehicles, and 24/7 on-road support.',
    heroImage: onboardingBg,
  },
];

const COMPACT_CHECKLIST = [
  { label: 'Verified Agencies', desc: '100% vetted and licensed partners' },
  { label: 'Secure Payments', desc: 'Instant confirmations & easy refunds' },
  { label: 'One-Time Travel Profile', desc: 'Seamless booking across all journeys' },
  { label: 'Live Trip Updates', desc: 'Real-time vehicle and itinerary alerts' },
];

export const OnboardingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const currentDesktopData = DESKTOP_SLIDES[currentSlide] || DESKTOP_SLIDES[0];

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE & TABLET LAYOUT (UNTOUCHED & PRESERVED)                           */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full min-h-screen">
        <AuthLayout
          heroTitle="Discover, Connect, and Travel with ApnaTrip"
          heroSubtitle="Your ultimate travel companion for exploring world's best places and joining vibrant traveler communities."
        >
          {/* Header bar on top of all onboarding screens */}
          <Header
            showBack={currentSlide > 0}
            onBack={handleBack}
            showProgress={true}
            currentStep={currentSlide + 1}
            totalSteps={4}
            showSkip={true}
            onSkip={handleSkip}
            variant={currentSlide === 0 ? 'light' : 'dark'}
            className={currentSlide === 0 ? 'absolute top-0 inset-x-0 z-30' : ''}
          />

          {/* Main Onboarding Carousel Card */}
          <OnboardingCard
            currentSlide={currentSlide}
            onNext={handleNext}
            onSelectSlide={(index) => setCurrentSlide(index)}
            onNavigateLogin={() => navigate('/login')}
          />
        </AuthLayout>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (Full Screen Edge-to-Edge: 40% Left Panel / 60% Hero Image) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden select-none bg-white">
        {/* LEFT CONTENT PANEL (40%) */}
        <div className="w-[40%] h-full bg-white flex flex-col justify-between p-8 xl:p-12 2xl:p-16 z-10 text-left border-r border-slate-100 overflow-y-auto">
            
            {/* Top Bar: Brand Logo + Onboarding Progress Indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100/90">
              <Logo variant="light" size="sm" />

              {/* Progress Indicator at top of content area */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {DESKTOP_SLIDES.map((_, stepIdx) => (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={() => setCurrentSlide(stepIdx)}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                        currentSlide === stepIdx
                          ? 'w-7 bg-gradient-to-r from-[#FF4D6D] to-[#FF3358]'
                          : stepIdx < currentSlide
                          ? 'w-3 bg-slate-400'
                          : 'w-3 bg-slate-200'
                      }`}
                      aria-label={`Go to step ${stepIdx + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-400 ml-1.5 tabular-nums">
                  0{currentSlide + 1} / 0{DESKTOP_SLIDES.length}
                </span>
              </div>
            </div>

            {/* Middle Content: Left-Aligned Headline, Subtitle & Compact Checklist */}
            <div className="my-auto py-4 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-extrabold text-[#FF4D6D] w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>{currentDesktopData.badge}</span>
                  </div>

                  {/* Left-Aligned Main Title */}
                  <h1 className="text-2xl xl:text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
                    {currentDesktopData.title}
                  </h1>

                  {/* Left-Aligned Subtitle */}
                  <p className="text-xs xl:text-sm font-medium text-slate-500 leading-relaxed max-w-md">
                    {currentDesktopData.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Compact Checklist (Replacing large feature cards) */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100/80">
                {COMPACT_CHECKLIST.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs xl:text-sm font-bold text-[#0F172A]">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium hidden xl:inline">
                        — {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Cleaner Primary "Continue →" & Secondary "Skip" */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100/90">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer py-2 px-3 rounded-xl hover:bg-slate-50 focus:outline-none"
              >
                Skip
              </button>

              <div className="flex items-center gap-3">
                {currentSlide > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-bold transition-all cursor-pointer hover:bg-slate-50 focus:outline-none"
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] hover:opacity-95 text-white text-xs sm:text-sm font-black shadow-md shadow-[#FF4D6D]/20 transition-all flex items-center gap-2 cursor-pointer focus:outline-none group"
                >
                  <span>{currentSlide === 2 ? 'Get Started' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT HERO IMAGE (60%) */}
          <div className="w-[60%] h-full relative overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={currentDesktopData.heroImage}
                alt="ApnaTrip Onboarding"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full h-full object-cover object-[center_38%]"
              />
            </AnimatePresence>

            {/* Subtle dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Short Headline in lower-left corner (Mostly unobstructed image) */}
            <div className="absolute bottom-10 left-10 xl:bottom-12 xl:left-12 z-10 max-w-md pointer-events-none">
              <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                Discover. Connect. Travel.
              </h2>
              <p className="text-xs xl:text-sm text-slate-200/90 font-medium mt-2 drop-shadow-sm max-w-sm leading-relaxed">
                Explore amazing destinations, connect with travelers and book with trusted travel agencies.
              </p>
            </div>
          </div>
      </div>
    </>
  );
};

export default OnboardingPage;
