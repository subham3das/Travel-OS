import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Users, Compass } from 'lucide-react';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import { PaginationDots } from '../common/ProgressDots';

import onboardingBg from '../../../assets/onbording_background.jpg';
import peopleConnectImg from '../../../assets/people connect.png';

interface OnboardingSlideData {
  id: number;
  title: string;
  subtitle: string;
}

interface OnboardingCardProps {
  currentSlide: number;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  onNavigateLogin: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  currentSlide,
  onNext,
  onSelectSlide,
  onNavigateLogin,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden relative">
      {/* SLIDE 1: First Onboarding Screen with Full Background Image */}
      {currentSlide === 0 && (
        <motion.div
          key="slide-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 md:p-8 z-10"
        >
          {/* Full Background Image - centered on person */}
          <img
            src={onboardingBg}
            alt="ApnaTrip Onboarding Background"
            className="absolute inset-0 w-full h-full object-cover object-[center_38%] z-0"
          />

          {/* Vignette Overlay for readability while keeping central person clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 z-0" />

          {/* Top Logo Component */}
          <div className="relative z-10 pt-16 sm:pt-20 flex flex-col items-center">
            <Logo variant="light" size="md" showSubtitle />
          </div>

          {/* Bottom Overlay: Title, Subtitle, Get Started Button & Login Link */}
          <div className="relative z-10 flex flex-col gap-6 pt-12 pb-2">
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                Discover.<br />
                Connect.<br />
                Travel.
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-sm">
                Explore amazing destinations, connect with travelers and book with trusted travel agencies.
              </p>
            </div>

            {/* Action Buttons & Navigation */}
            <div className="flex flex-col items-center gap-4 w-full">
              <Button onClick={onNext} showArrow>
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SLIDE 2: Second Onboarding Screen (Discover Amazing Destinations) */}
      {currentSlide === 1 && (
        <motion.div
          key="slide-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full flex-1 flex flex-col justify-between p-6 md:p-8"
        >
          {/* Header Title & Subtitle */}
          <div className="space-y-2 pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Discover Amazing Destinations
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
              Find the best places to visit and hidden gems recommended by real travelers.
            </p>
          </div>

          {/* Destination Showcase Card Container */}
          <div className="w-full my-3">
            {/* Image Card */}
            <div className="relative w-full h-[300px] sm:h-[330px] rounded-[32px] overflow-hidden shadow-soft border border-slate-100">
              {/* Bali Tropical Resort Background Photo */}
              <img
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800"
                alt="Bali, Indonesia"
                className="w-full h-full object-cover"
              />

              {/* Top Left Tag */}
              <div className="absolute top-4 left-4 z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-sm text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>Bali, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Bottom Floating Stats Banner - Overlapping image edge-to-edge */}
            <div className="relative -mt-10 mx-3 z-20 bg-white rounded-[26px] p-3.5 shadow-soft-lg border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Overlapping Empty Gray Traveler Avatars */}
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border-2 border-white shadow-xs" />
                  <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border-2 border-white shadow-xs" />
                  <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border-2 border-white shadow-xs" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[#0F172A]">250+ Travelers</h4>
                  <p className="text-xs text-slate-500 font-medium">explored this place</p>
                </div>
              </div>

              {/* Heart Action Button */}
              <button
                aria-label="Save destination"
                className="w-10 h-10 rounded-full bg-rose-100/80 text-[#FF4D6D] flex items-center justify-center hover:bg-rose-200/80 transition-colors"
              >
                <Heart className="w-5 h-5 fill-[#FF4D6D]" />
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col items-center gap-6 pt-2">
            <PaginationDots total={3} current={1} onSelect={onSelectSlide} />
            <Button onClick={onNext} showArrow>
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* SLIDE 3: Third Onboarding Screen (Connect with Travelers) */}
      {currentSlide === 2 && (
        <motion.div
          key="slide-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full flex-1 flex flex-col justify-between p-6 md:p-8"
        >
          {/* Header Title & Subtitle */}
          <div className="space-y-2 pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Connect with Travelers
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
              Join a community of explorers, share stories, tips and travel together.
            </p>
          </div>

          {/* Connect with Travelers Blended Artwork */}
          <div className="relative w-full h-[320px] sm:h-[360px] my-4 flex items-center justify-center">
            <img
              src={peopleConnectImg}
              alt="Connect with Travelers"
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col items-center gap-6 pt-2">
            <PaginationDots total={3} current={2} onSelect={onSelectSlide} />
            <Button onClick={onNavigateLogin} showArrow>
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
