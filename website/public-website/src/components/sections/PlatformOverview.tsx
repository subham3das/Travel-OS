import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Building2,
  ShieldCheck,
  Users2,
  Route,
  KeyRound,
  CheckCircle,
  ChevronRight,
  Compass,
  MapPin,
  Plane,
} from 'lucide-react';

interface Pillar {
  id: string;
  name: string;
  icon: typeof Smartphone;
  headline: string;
  tagline: string;
  description: string;
  features: string[];
  mockupUrl: string;
  path: string;
  badge: string;
}

const pillars: Pillar[] = [
  {
    id: 'traveler',
    name: 'Traveler App',
    icon: Smartphone,
    headline: 'Travel Smarter. Everything in One App.',
    tagline: 'Personalized Journeys & Seamless Trips',
    description:
      'Discover destinations, book verified travel packages, complete KYC, manage bookings, earn rewards and stay connected throughout your journey.',
    features: [
      'Live Booking Engine & instant voucher issuance',
      'One-time Unified Digital KYC verification',
      'Milestone payment escrow — released post check-in',
      'Emergency SOS & 24×7 live on-trip concierge',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    path: 'traveler-app',
    badge: 'Mobile Native & PWA',
  },
  {
    id: 'agency',
    name: 'Agency Portal',
    icon: Building2,
    headline: 'A Complete Operating System For Travel Agencies.',
    tagline: 'Enterprise Growth & Operations Engine',
    description:
      'Manage packages, departures, bookings, customers, settlements, payments, analytics and communications from one powerful dashboard.',
    features: [
      'Multi-day dynamic package & departure scheduler',
      'Real-time automated customer confirmation & chat',
      'Direct escrow settlements with zero delayed payouts',
      'Agency performance, lead pipeline & margin metrics',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80',
    path: 'agency-portal',
    badge: 'SaaS Platform',
  },
  {
    id: 'car-booking',
    name: 'Route Booking',
    icon: Route,
    headline: 'Transparent Route-Based Travel.',
    tagline: 'Fixed & Intercity Route Transport',
    description:
      'Choose verified routes with fixed pricing, instant confirmations and professional drivers without hidden costs.',
    features: [
      'Transparent flat fares with zero surge multipliers',
      'Verified commercial drivers & vehicle safety audits',
      'Fixed scheduled departure slots & curated pickup hubs',
      'Live vehicle GPS tracking shared with loved ones',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
    path: 'route-booking',
    badge: '45+ Active Routes',
  },
  {
    id: 'rental',
    name: 'Self Drive Rentals',
    icon: KeyRound,
    headline: 'Rent Cars & Bikes With Confidence.',
    tagline: 'Explore India on Your Own Wheels',
    description:
      'Browse verified vehicles, compare pricing, upload documents once and enjoy a seamless pickup experience.',
    features: [
      'Verified fleets: SUVs, 4x4s, Himalayans & city sedans',
      '100% digital checklist inspection at handover',
      'Doorstep handover at major transit airports & stations',
      'Zero arbitrary deposit holdbacks or hidden deductions',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    path: 'self-drive',
    badge: '120+ Fleet Hubs',
  },
  {
    id: 'community',
    name: 'Community',
    icon: Users2,
    headline: 'Travel Together. Stay Connected.',
    tagline: 'Official ApnaTrip WhatsApp Communities',
    description:
      'Join the official ApnaTrip WhatsApp Communities to connect with fellow travelers, get verified travel updates, discover destinations, and stay informed about upcoming group trips.',
    features: [
      'Verified travel updates & destination tips',
      'Group trip notifications & agency announcements',
      'Travel Q&A with experienced explorers',
      'Local travel tips & route conditions',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80',
    path: 'community',
    badge: 'WhatsApp Communities',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: ShieldCheck,
    headline: 'Enterprise-Level Platform Governance.',
    tagline: 'Compliance, Audit & Ecosystem Safety',
    description:
      'Monitor agencies, KYC, settlements, payments, analytics and platform health from one centralized control center.',
    features: [
      'Government compliance & GST/PAN documentation auditing',
      'Automated escrow reconciliation & fraud safety filters',
      'Real-time passenger dispute escalation & mediation desk',
      'Complete ecosystem financial & operational telemetry',
    ],
    mockupUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    path: 'admin-governance',
    badge: '99.98% Resolution',
  },
];

const ROTATION_INTERVAL_MS = 5500;
const PAUSE_RESUME_MS = 8000;

export default function PlatformOverview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activePillar = pillars[activeIndex];

  // Rotate to next slide (loops indefinitely)
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % pillars.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + pillars.length) % pillars.length);
  }, []);

  // Preload next slide mockup image
  useEffect(() => {
    const nextIdx = (activeIndex + 1) % pillars.length;
    const img = new Image();
    img.src = pillars[nextIdx].mockupUrl;
  }, [activeIndex]);

  // Autoplay timer with 5.5s interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Smoothly scroll active tab into view horizontally
  useEffect(() => {
    const activeBtn = tabButtonRefs.current[activeIndex];
    const container = tabsContainerRef.current;
    if (activeBtn && container) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Helper to trigger temporary pause (8s of inactivity before resume)
  const triggerInactivityPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, PAUSE_RESUME_MS);
  }, []);

  // Manual tab click: switches immediately and restarts pause countdown
  const handlePillClick = (index: number) => {
    setActiveIndex(index);
    triggerInactivityPause();
  };

  // Convert mouse vertical scroll wheel into horizontal scroll on the tabs bar
  const handleWheelOnTabs = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabsContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Section hover pauses; mouse leave resumes after brief inactivity
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  };

  const handleMouseLeave = () => {
    triggerInactivityPause();
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      triggerInactivityPause();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      triggerInactivityPause();
    }
  };

  return (
    <section
      id="overview"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="ApnaTrip Product Showcase"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 overflow-hidden outline-none"
    >
      {/* Subtle Background Elements & Floating Accent Circles */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Travel Decorative Icons */}
      <div className="absolute top-20 left-10 text-slate-200 dark:text-slate-800/40 pointer-events-none hidden xl:block animate-pulse">
        <Compass size={40} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-24 left-16 text-slate-200 dark:text-slate-800/40 pointer-events-none hidden xl:block">
        <MapPin size={36} strokeWidth={1.5} />
      </div>
      <div className="absolute top-36 right-12 text-slate-200 dark:text-slate-800/40 pointer-events-none hidden xl:block animate-pulse">
        <Plane size={36} strokeWidth={1.5} />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>OUR PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need For Modern Travel.
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            ApnaTrip is more than a booking platform. It’s an ecosystem connecting travelers,
            agencies, vehicle owners, communities and secure digital services into one experience.
          </p>
        </div>

        {/* 1. Horizontal Navigation: Never wraps, wheel-scrollable, snap, hidden scrollbar */}
        <div className="relative max-w-5xl mx-auto mb-12 sm:mb-16">
          {/* Subtle edge fade indicators for horizontal overflow */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10" />

          <div
            ref={tabsContainerRef}
            role="tablist"
            aria-label="Platform Showcase Navigation"
            onWheel={handleWheelOnTabs}
            className="flex items-center gap-2.5 overflow-x-auto py-2 px-8 scroll-smooth scrollbar-none snap-x snap-mandatory flex-nowrap"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeIndex === idx;

              return (
                <button
                  key={pillar.id}
                  ref={(el) => {
                    tabButtonRefs.current[idx] = el;
                  }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`showcase-panel-${pillar.id}`}
                  onClick={() => handlePillClick(idx)}
                  className={`group relative shrink-0 snap-center flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'text-white shadow-lg shadow-blue-600/25 scale-[1.02]'
                      : 'bg-white/95 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600/70 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xs'
                  }`}
                >
                  {/* Active Gradient Background with Shared Layout */}
                  {isActive && (
                    <motion.div
                      layoutId="activePillGlow"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 z-0"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500'
                      }`}
                    />
                    <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                    <span>{pillar.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content & Mockup Showcase Card: Smooth subtle content transitions */}
        <div
          id={`showcase-panel-${activePillar.id}`}
          role="tabpanel"
          className="max-w-6xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-sm"
            >
              {/* Left Column: Details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>{activePillar.badge}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {activePillar.headline}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {activePillar.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activePillar.description}
                </p>

                {/* Feature Bullets */}
                <div className="space-y-3 pt-1">
                  {activePillar.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Action */}
                <div className="pt-2">
                  <a
                    href={`https://app.apnatrip.in/${activePillar.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-200 group"
                  >
                    <span>Launch {activePillar.name}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Realistic Browser Mockup */}
              <div className="lg:col-span-7">
                <div className="relative group/mockup rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Browser Chrome Header */}
                  <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/90" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                    </div>
                    <div className="flex-1 max-w-sm mx-auto bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-md text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center truncate shadow-2xs">
                      https://app.apnatrip.in/{activePillar.path}
                    </div>
                  </div>

                  {/* Browser Content Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={activePillar.mockupUrl}
                      alt={activePillar.headline}
                      className="w-full h-full object-cover object-center group-hover/mockup:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay & Live Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6 sm:p-8">
                      <div className="text-white space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          <span>Interactive Preview</span>
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          {activePillar.name} Experience
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
