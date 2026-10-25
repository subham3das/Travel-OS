import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Car,
  Briefcase,
  ShieldCheck,
  Wallet,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Lock,
  Headphones,
  FileCheck,
  Sparkles,
  Mail,
  TrendingUp,
  XCircle,
  Smartphone,
  Users,
  Search,
  Share2,
  Megaphone,
  Zap,
  Calendar,
  DollarSign,
  Award,
  Clock,
  Compass,
  FileText,
  LayoutDashboard,
  Key,
  Check,
  PhoneCall,
  Globe2,
  Star,
  ShieldAlert,
  Sliders,
  Fuel,
  Gauge,
  Navigation,
} from 'lucide-react';

const PARTNER_TABS = [
  { id: 'agency', label: 'Travel Agency Partners', icon: Building2, tag: 'Tours & Experiences' },
  { id: 'rental', label: 'Rental & Fleet Partners', icon: Car, tag: 'Vehicles & Mobility' },
] as const;

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState<'agency' | 'rental'>('agency');

  return (
    <>
      <Helmet>
        <title>Partner With Us — The Growth Operating System for Travel & Fleet | ApnaTrip</title>
        <meta
          name="description"
          content="Pitch deck for Travel Agencies and Car Rental Fleet Operators. Multiply your bookings, automate operations, protect revenue with escrow, and scale your brand with ApnaTrip."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-24 selection:bg-blue-500 selection:text-white">
        {/* Hero Header Section */}
        <div className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4"
            >
              <Briefcase size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Partner Ecosystem</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Partner With Us
              <br />
              <span className="text-blue-600 dark:text-blue-400">Growth Operating System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Scale your travel agency or fleet operations with India&apos;s trusted travel technology platform. Get discovered, manage bookings digitally, and protect revenue with automated milestone escrow.
            </motion.p>

            {/* Informational Partner Track Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <div className="relative p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 inline-flex flex-wrap sm:flex-nowrap gap-1.5 shadow-sm">
                {PARTNER_TABS.map((tab) => {
                  const isActive = partnerType === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPartnerType(tab.id)}
                      className={`relative z-10 flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer select-none ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activePartnerTab"
                          className="absolute inset-0 rounded-xl bg-blue-600 shadow-md shadow-blue-600/25 -z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 460,
                            damping: 35,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Dynamic Pitch Presentation Slides ───────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={partnerType}
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {partnerType === 'agency' ? (
              /* ============================================================= */
              /* SECTION 1: TRAVEL AGENCY PARTNERS PITCH                       */
              /* ============================================================= */
              <div className="space-y-28">
                {/* ── Slide: Agency Hero ───────────────────────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/80 dark:from-blue-950/70 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-white p-8 sm:p-12 md:p-16 border border-blue-200/80 dark:border-blue-500/20 shadow-xl dark:shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                        Grow Your Travel Business with ApnaTrip
                      </h2>

                      <p className="text-slate-600 dark:text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
                        Get discovered by more travelers, manage bookings digitally, build trust, and grow your agency with India&apos;s travel technology platform.
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a
                          href="https://app.apnatrip.in/agency/signup"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                        >
                          <span>Become an Agency Partner</span>
                          <ArrowRight size={16} />
                        </a>
                        <a
                          href="tel:+919954060000"
                          className="px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300/80 dark:border-white/20 text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <PhoneCall size={16} />
                          <span>Talk to Sales (+91 9954060000)</span>
                        </a>
                      </div>

                      {/* Key Deck Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200 dark:border-white/10">
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">10x</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Discovery Reach</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Milestone Escrow</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">&lt; 24h</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Direct Settlements</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">₹0</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Setup Hassle</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Current Problems Agencies Face ────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <ShieldAlert size={13} />
                      <span>The Industry Challenge</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Running a Travel Agency Isn&apos;t Easy
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Most tour operators and agency founders lose up to 40% of their operational hours handling fragmented tools and fighting low digital credibility.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      {
                        title: 'Limited customer reach',
                        desc: 'Constrained to local foot traffic and word-of-mouth recommendations within your immediate city.',
                        icon: Users,
                      },
                      {
                        title: 'Heavy dependence on WhatsApp',
                        desc: 'Inquiries get lost in chaotic personal chat threads, forgotten follow-ups, and unorganized quotes.',
                        icon: Smartphone,
                      },
                      {
                        title: 'Manual booking management',
                        desc: 'Managing departure dates, passenger manifests, and seat allotments across confusing spreadsheets.',
                        icon: Layers,
                      },
                      {
                        title: 'Difficult payment tracking',
                        desc: 'Chasing bank transfers, screenshot proofs, unverified NEFTs, and stressful payment follow-ups.',
                        icon: DollarSign,
                      },
                      {
                        title: 'No professional online presence',
                        desc: 'Building and maintaining a modern booking website costs lakhs in development and hosting.',
                        icon: Globe2,
                      },
                      {
                        title: 'Hard to build customer trust',
                        desc: 'Modern travelers hesitate to transfer advances to unfamiliar bank accounts without official buyer protection.',
                        icon: Lock,
                      },
                      {
                        title: 'Marketing is expensive',
                        desc: 'Google Ads, Meta ads, and travel portals demand massive upfront budgets with unpredictable ROI.',
                        icon: Megaphone,
                      },
                      {
                        title: 'Managing itineraries manually',
                        desc: 'Copy-pasting day-by-day itineraries, inclusions, and hotel terms into Word documents repeatedly.',
                        icon: FileText,
                      },
                      {
                        title: 'Losing leads to competitors',
                        desc: 'Delayed quote responses cause travelers to book with large aggregators before you reply.',
                        icon: TrendingUp,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/60 hover:border-rose-300 dark:hover:border-rose-800 transition-all shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <XCircle size={15} className="text-rose-500 shrink-0" />
                          <span>{item.title}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: How ApnaTrip Solves These Problems ────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles size={13} />
                      <span>The Transformation</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      How ApnaTrip Solves These Problems
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Upgrade from chaotic manual operations to an enterprise-grade digital travel operating system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Without ApnaTrip */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500">Traditional Agency</span>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">Without ApnaTrip</h3>
                        </div>
                        <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
                          <XCircle size={22} />
                        </span>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Manual inquiries scattered across phone calls and WhatsApp',
                          'No online discovery beyond word of mouth',
                          'Paper records and messy Excel sheets',
                          'Limited customers restricted to local geography',
                          'Hard to scale operations without hiring large staff',
                        ].map((point, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <XCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: With ApnaTrip */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/40 border-2 border-blue-500/40 dark:border-blue-500/30 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-blue-900/60">
                        <div>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Modern Digital Partner</span>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">With ApnaTrip</h3>
                        </div>
                        <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                          <Check size={22} />
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          'Digital agency profile accessible 24/7 across India',
                          'Online visibility on top-ranked destination portals',
                          'Smart booking dashboard with instant departure manifests',
                          'Customer management CRM with quote generation',
                          'Automated booking workflow & instant PDF vouchers',
                          'Professional brand presence with verified agency credentials',
                          'Verified Partner Badge providing immediate traveler trust',
                          'Better trust with built-in milestone escrow protection',
                          'Business analytics and conversion performance reports',
                        ].map((point, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                            <CheckCircle2 size={17} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Grow Your Revenue ─────────────────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <TrendingUp size={13} />
                      <span>Revenue Multiplication</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      More Visibility = More Bookings
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      ApnaTrip helps agencies receive inquiries from travelers actively looking for verified travel experiences.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Destination discovery',
                        desc: 'Appear directly in front of travelers searching for curated tour circuits across Kashmir, Himachal, Kerala, Rajasthan, and the Northeast.',
                        icon: Search,
                        tag: 'High-Intent Leads',
                      },
                      {
                        title: 'Featured recommendations',
                        desc: 'Receive priority placement on seasonal holiday pages, top circuit picks, and weekend getaway showcases.',
                        icon: Award,
                        tag: 'Algorithmic Boost',
                      },
                      {
                        title: 'Verified agency profile',
                        desc: 'A complete credibility suite displaying your registration, licenses, safety track record, and verified partner badge.',
                        icon: ShieldCheck,
                        tag: '100% Verified',
                      },
                      {
                        title: 'Better search visibility',
                        desc: 'Benefit from platform-wide search engine optimization, indexing your itineraries on Google without high ad costs.',
                        icon: Globe2,
                        tag: 'Zero Ad Spend',
                      },
                      {
                        title: 'Repeat customers',
                        desc: 'Build a long-term traveler database with automated loyalty touchpoints, re-engagement campaigns, and reviews.',
                        icon: Users,
                        tag: 'Lifetime Value',
                      },
                      {
                        title: 'Customer trust',
                        desc: 'Transparent pricing, verified itineraries, and protected booking workflows convert hesitant inquiries into paid bookings.',
                        icon: Lock,
                        tag: 'Higher Conversion',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <item.icon size={22} />
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Your Digital Storefront ───────────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 sm:p-12 md:p-16 border border-slate-200/90 dark:border-slate-800 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                      <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                          <LayoutDashboard size={13} />
                          <span>Brand Identity</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                          Your Digital Storefront
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                          Stop sending travelers generic WhatsApp brochures. Every ApnaTrip partner receives an enterprise-grade digital storefront that establishes immediate credibility and showcases your packages beautifully.
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {[
                            'Business profile & story',
                            'High-res photo gallery',
                            'Official agency information',
                            'Multi-day package showcase',
                            'Verified traveler reviews',
                            'Direct contact information',
                            'Verified Partner Badge',
                            'Social & web links',
                          ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4">
                          <a
                            href="https://app.apnatrip.in/agency/signup"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/20"
                          >
                            <span>Claim Your Agency Storefront</span>
                            <ArrowRight size={14} />
                          </a>
                        </div>
                      </div>

                      {/* Storefront Mockup Card */}
                      <div className="lg:col-span-6">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-lg space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              <span className="text-[11px] font-mono text-slate-500 ml-2">apnatrip.in/agency/himalayan-escapes</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck size={11} /> Verified Partner
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Himalayan Escapes Pvt Ltd</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Manali, Himachal Pradesh • Est. 2018</p>
                              </div>
                              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                                <Star size={13} className="fill-amber-400 text-amber-500" />
                                <span>4.9 (184 reviews)</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center pt-1">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                                <div className="text-xs font-bold text-slate-900 dark:text-white">14</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Tours Active</div>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">&lt; 15 min</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Response</div>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">100%</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Escrow Ready</div>
                              </div>
                            </div>
                          </div>

                          {/* Mini Package Showcase item */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Featured Tour</span>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Spiti Valley High Altitude Expedition (7D/6N)</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">Departure: Every Saturday • Fixed Departures</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-900 dark:text-white">₹24,500</div>
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Instant Inquiry</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Business Dashboard (Agency OS) ────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <LayoutDashboard size={13} />
                      <span>Software Infrastructure</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Business Dashboard
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Everything needed to operate a profitable tour agency from a single cloud portal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Package Management',
                        desc: 'Drag-and-drop itinerary builder with daily breakdown, inclusions, exclusions, and high-res media.',
                        icon: Compass,
                      },
                      {
                        title: 'Booking Management',
                        desc: 'Real-time booking confirmations, seat roster tracking, and traveler manifest downloads.',
                        icon: FileCheck,
                      },
                      {
                        title: 'Customer Management',
                        desc: 'Traveler CRM with past trip history, emergency contact details, dietary notes, and ID verification.',
                        icon: Users,
                      },
                      {
                        title: 'Availability Calendar',
                        desc: 'Live departure schedules, seasonal inventory control, and blackout dates management.',
                        icon: Calendar,
                      },
                      {
                        title: 'Pricing Control',
                        desc: 'Dynamic seasonal rates, early bird discounts, twin sharing add-ons, and group pricing rules.',
                        icon: DollarSign,
                      },
                      {
                        title: 'Lead Management',
                        desc: 'Centralized inbound traveler inquiries with instant notifications and quotation builder.',
                        icon: Megaphone,
                      },
                      {
                        title: 'Automated Invoices',
                        desc: 'GST-compliant invoice generation and instant branded PDF vouchers for verified passengers.',
                        icon: FileText,
                      },
                      {
                        title: 'Business Analytics',
                        desc: 'Detailed conversion metrics, traffic analytics, and top-selling tour comparisons.',
                        icon: BarChart3,
                      },
                      {
                        title: 'Performance Reports',
                        desc: 'Monthly gross bookings, traveler satisfaction scores, and payout reconciliation reports.',
                        icon: TrendingUp,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Business Insights & Analytics ─────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <BarChart3 size={13} />
                      <span>Data-Driven Growth</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Business Insights
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Agencies can monitor key commercial metrics in real time to optimize pricing and itinerary planning.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: 'Package views', value: '4,280+', sub: 'Unique views this month', metric: '+32% MoM', icon: Search },
                      { label: 'Customer inquiries', value: '186', sub: 'High-intent booking queries', metric: '48h avg closure', icon: Mail },
                      { label: 'Booking requests', value: '94', sub: 'Confirmed trip requests', metric: '82% conversion', icon: CheckCircle2 },
                      { label: 'Popular destinations', value: 'Kashmir & Spiti', sub: 'Top performing circuits', metric: 'Peak Demand', icon: Compass },
                      { label: 'Revenue performance', value: '₹18.4L', sub: 'Gross Booking Value', metric: '100% Escrow Settled', icon: Wallet },
                      { label: 'Customer growth', value: '+44%', sub: 'New vs repeat traveler ratio', metric: '★ 4.9 Rating', icon: TrendingUp },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold uppercase tracking-wider">{card.label}</span>
                          <card.icon size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {card.value}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">{card.sub}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{card.metric}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Marketing Support ─────────────────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 border border-blue-200/80 dark:border-slate-800 space-y-8">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                        <Megaphone size={13} />
                        <span>Demand Generation</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Marketing Support
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
                        You do not need to hire an expensive digital marketing agency. ApnaTrip invests continuously in high-intent customer acquisition for our verified partners.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { title: 'Search Engine Optimization', desc: 'Rank on Google for top domestic search queries.', icon: Globe2 },
                        { title: 'Destination Pages', desc: 'Dedicated landing hubs for every major circuit in India.', icon: Compass },
                        { title: 'Social Media', desc: 'Showcase of partner experiences on Instagram and YouTube.', icon: Share2 },
                        { title: 'Featured Listings', desc: 'Prominent homepage badges for top-rated agencies.', icon: Award },
                        { title: 'Email Campaigns', desc: 'Targeted holiday newsletters to over 50,000+ travelers.', icon: Mail },
                        { title: 'Seasonal Promotions', desc: 'Festival, summer, and monsoon discount campaign co-ops.', icon: Sparkles },
                        { title: 'Organic Discovery', desc: 'Smart algorithm matching traveler preference with itineraries.', icon: Search },
                        { title: 'Platform Promotions', desc: 'Site-wide booking campaigns during peak travel seasons.', icon: Zap },
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                          <item.icon size={18} className="text-blue-600 dark:text-blue-400" />
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── Slide: How You Earn More (Infographic Flow) ──────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <DollarSign size={13} />
                      <span>Frictionless Workflow</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      How You Earn More
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      A clear, end-to-end monetization model where you keep your margins and eliminate payment risk.
                    </p>
                  </div>

                  {/* Step Sequence */}
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
                    {[
                      { step: '01', title: 'Traveler discovers package', desc: 'On destination guide or search feed' },
                      { step: '02', title: 'Inquiry received', desc: 'Instant notification on your portal' },
                      { step: '03', title: 'Agency responds', desc: 'Confirm availability & dates' },
                      { step: '04', title: 'Booking confirmed', desc: 'Automated itinerary voucher created' },
                      { step: '05', title: 'Payment processed', desc: 'Secured via Razorpay Escrow' },
                      { step: '06', title: 'Successful trip', desc: 'Traveler enjoys verified experience' },
                      { step: '07', title: 'Agency settlement', desc: 'Direct NEFT within 24 hours' },
                    ].map((st, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2 relative shadow-sm"
                      >
                        <div className="w-7 h-7 mx-auto rounded-full bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                          {st.step}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {st.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Callout */}
                  <div className="mt-8 p-6 rounded-2xl bg-blue-600 text-white text-center shadow-lg shadow-blue-600/20 max-w-3xl mx-auto">
                    <p className="text-sm sm:text-base font-semibold">
                      &ldquo;You focus on delivering great travel experiences while ApnaTrip helps increase your digital visibility and secures your revenue.&rdquo;
                    </p>
                  </div>
                </section>

                {/* ── Slide: Why Become an Early Partner ───────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Award size={13} />
                      <span>Founding Privileges</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Why Become an Early Partner
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Agencies that join during our 2026 rollout lock in permanent visibility advantages.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Priority Visibility',
                        desc: 'Founding partners are featured at the very top of destination search results permanently.',
                        icon: TrendingUp,
                      },
                      {
                        title: 'Founding Partner Recognition',
                        desc: 'Special platform badge that communicates early adopter authority and verified trust to travelers.',
                        icon: Award,
                      },
                      {
                        title: 'Access to New Features First',
                        desc: 'Direct line to our engineering team to request custom features for your agency workflow.',
                        icon: Sparkles,
                      },
                      {
                        title: 'Dedicated Support',
                        desc: 'Direct priority WhatsApp & phone hotline with your assigned ApnaTrip partner success manager.',
                        icon: Headphones,
                      },
                      {
                        title: 'Marketing Assistance',
                        desc: 'Free itinerary copywriting review, image enhancement, and destination page spotlights.',
                        icon: Megaphone,
                      },
                      {
                        title: 'Growing Customer Network',
                        desc: 'Be the first recommendation as our traveler member base expands across Tier 1, 2, and 3 cities.',
                        icon: Users,
                      },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <b.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {b.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Agency Registration Timeline ──────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Clock size={13} />
                      <span>Speed to Market</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Agency Registration
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Complete your digital onboarding in 5 straightforward steps. Go live in under 24 hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { step: '01', title: 'Register', desc: 'Create account with business email & contact details.' },
                      { step: '02', title: 'Complete Verification', desc: 'Submit business license / GSTIN for quick compliance review.' },
                      { step: '03', title: 'Create Business Profile', desc: 'Upload your agency logo, story, cover photo & social links.' },
                      { step: '04', title: 'Upload Packages', desc: 'Publish itineraries with departure dates, hotels, and pricing.' },
                      { step: '05', title: 'Start Receiving Inquiries', desc: 'Accept verified traveler bookings and grow your revenue.' },
                    ].map((tl, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm relative"
                      >
                        <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                          {tl.step}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {tl.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {tl.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <a
                      href="https://app.apnatrip.in/agency/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Start Agency Registration Now</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </section>
              </div>
            ) : (
              /* ============================================================= */
              /* SECTION 2: VEHICLE RENTAL PARTNERS PITCH                      */
              /* ============================================================= */
              <div className="space-y-28">
                {/* ── Slide: Rental Hero ───────────────────────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/80 dark:from-teal-950/70 dark:via-slate-900 dark:to-blue-950 text-slate-900 dark:text-white p-8 sm:p-12 md:p-16 border border-teal-200/80 dark:border-teal-500/20 shadow-xl dark:shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                        Grow Your Vehicle Rental Business with ApnaTrip
                      </h2>

                      <p className="text-slate-600 dark:text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
                        Connect your fleet with travelers looking for reliable transportation across India.
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a
                          href="https://app.apnatrip.in/rental/signup"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold shadow-lg shadow-teal-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                        >
                          <span>Become a Rental Partner</span>
                          <ArrowRight size={16} />
                        </a>
                        <a
                          href="tel:+919954060000"
                          className="px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300/80 dark:border-white/20 text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <PhoneCall size={16} />
                          <span>Talk to Sales (+91 9954060000)</span>
                        </a>
                      </div>

                      {/* Key Deck Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200 dark:border-white/10">
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">85%+</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Fleet Utilization</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">KYC Verified Renters</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 24h</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Direct Bank Settlement</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">0</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Dead Mileage Days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Problems Rental Businesses Face ───────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <ShieldAlert size={13} />
                      <span>Current Challenges</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Problems Rental Businesses Face
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Fleet owners suffer heavy capital depreciation while vehicles sit idle on parking lots due to localized, erratic demand.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      {
                        title: 'Vehicles stay idle',
                        desc: 'Cars sit in garages for days during weekdays without generating any revenue to cover EMIs.',
                        icon: Clock,
                      },
                      {
                        title: 'Hard to find new customers',
                        desc: 'Reaching visiting tourists before they land in your city is nearly impossible without costly ads.',
                        icon: Search,
                      },
                      {
                        title: 'Dependence on local contacts',
                        desc: 'Relying exclusively on local hotel desks and taxi brokers who demand heavy commissions.',
                        icon: Users,
                      },
                      {
                        title: 'Manual booking process',
                        desc: 'Juggling phone calls, WhatsApp messages, paper trip sheets, and verbal promises.',
                        icon: PhoneCall,
                      },
                      {
                        title: 'No digital presence',
                        desc: 'Lacking a professional mobile-friendly website where travelers can view real photos and book.',
                        icon: Globe2,
                      },
                      {
                        title: 'Payment follow-ups',
                        desc: 'Delayed settlements, unreturned security deposits, and stressful payment reconciliations.',
                        icon: DollarSign,
                      },
                      {
                        title: 'No centralized booking system',
                        desc: 'Accidental double bookings, scheduling conflicts, and poor dispatch coordination.',
                        icon: Layers,
                      },
                      {
                        title: 'Poor fleet visibility',
                        desc: 'Tourists cannot discover your specialized 4x4s, Tempo Travellers, or luxury sedans.',
                        icon: Navigation,
                      },
                      {
                        title: 'Low repeat customers',
                        desc: 'No automated mechanism to retain satisfied travelers or encourage repeat outstation bookings.',
                        icon: TrendingUp,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/60 hover:border-rose-300 dark:hover:border-rose-800 transition-all shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <XCircle size={15} className="text-rose-500 shrink-0" />
                          <span>{item.title}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: How ApnaTrip Helps (Replace Manual Work) ──────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Zap size={13} />
                      <span>Technology Over Manual Work</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      How ApnaTrip Helps
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Transform idle vehicles into predictable daily revenue with automated dispatch and verified traveler demand.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Without ApnaTrip */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500">Traditional Fleet Operation</span>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">Without ApnaTrip</h3>
                        </div>
                        <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
                          <XCircle size={22} />
                        </span>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Idle vehicles parked on lots earning nothing',
                          'Chaotic phone bookings with unverified verbal quotes',
                          'Manual pricing and endless customer haggling',
                          'No online discovery by travelers visiting your city',
                          'Limited growth restricted to neighborhood contacts',
                        ].map((point, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <XCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: With ApnaTrip */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50/50 dark:from-slate-900 dark:to-teal-950/40 border-2 border-teal-500/40 dark:border-teal-500/30 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between pb-4 border-b border-teal-100 dark:border-teal-900/60">
                        <div>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Modern Fleet Operator</span>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">With ApnaTrip</h3>
                        </div>
                        <span className="p-2 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30">
                          <Check size={22} />
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          'Digital fleet profile with real vehicle specs and photos',
                          'Verified business credibility that inspires customer confidence',
                          'Instant booking requests directly inside your dashboard',
                          'Better customer trust with clear security deposit terms',
                          'Unified business dashboard for all vehicles and drivers',
                          'Vehicle management with live availability toggle',
                          'Real-time revenue tracking and 24-hour settlements',
                          'Professional online presence across all Indian destination hubs',
                        ].map((point, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                            <CheckCircle2 size={17} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Fleet Management (All Vehicle Types) ──────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Fuel size={13} />
                      <span>Versatile Asset Class</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Fleet Management
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Whether you operate a fleet of 2 cars or 50 commercial coaches, ApnaTrip provides specialized category tooling.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Cars & Sedans',
                        desc: 'Hatchbacks, compacts, and executive sedans for city errands, business trips, and day tours.',
                        icon: Car,
                        tag: 'City & Outstation',
                      },
                      {
                        title: 'SUVs & 4x4s',
                        desc: 'Rugged 7-seaters, Thar, Scorpio, and Innova Crysta for hilly mountain circuits and family vacations.',
                        icon: Compass,
                        tag: 'High Demand',
                      },
                      {
                        title: 'Tempo Travellers',
                        desc: '12-seater to 26-seater executive minibuses for corporate retreats and large family groups.',
                        icon: Users,
                        tag: 'Group Transit',
                      },
                      {
                        title: 'Luxury Vehicles',
                        desc: 'Premium German sedans and luxury SUVs for VIP delegations, weddings, and executive hire.',
                        icon: Award,
                        tag: 'Premium Tariffs',
                      },
                      {
                        title: 'Self Drive Fleet',
                        desc: 'Automated odometer capture, digital fuel-level checks, and pre-authorized security deposit management.',
                        icon: Key,
                        tag: 'Self Drive',
                      },
                      {
                        title: 'Route Pricing Engine',
                        desc: 'Set fixed airport transfer fees, point-to-point outstation tariffs, or per-kilometer hourly packages.',
                        icon: DollarSign,
                        tag: 'Dynamic Pricing',
                      },
                      {
                        title: 'Vehicle Availability',
                        desc: 'One-click status toggles: Available, Under Maintenance, On Active Trip, or Reserved.',
                        icon: Gauge,
                        tag: 'Real-Time State',
                      },
                      {
                        title: 'Booking Calendar',
                        desc: 'Visual drag-and-drop dispatch calendar showing vehicle schedules across days and weeks.',
                        icon: Calendar,
                        tag: 'Zero Double Booking',
                      },
                      {
                        title: 'Driver Information',
                        desc: 'Store verified commercial licenses, police badges, contact info, and customer ratings.',
                        icon: ShieldCheck,
                        tag: 'Verified Chauffeurs',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 transition-all shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <item.icon size={20} />
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Business Dashboard (Fleet Control Center) ─────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <LayoutDashboard size={13} />
                      <span>Unified Fleet Operating System</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Business Dashboard
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Complete visibility into every vehicle, booking request, dispatch schedule, and settlement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Vehicle Listings',
                        desc: 'Add vehicle make, model, registration number, fuel type, transmission, seating, and photos.',
                        icon: Car,
                      },
                      {
                        title: 'Booking Requests',
                        desc: 'Instant review of incoming rental requests with renter destination, dates, and payout amount.',
                        icon: FileCheck,
                      },
                      {
                        title: 'Availability Control',
                        desc: 'Toggle vehicle availability on/off instantly when cars are in service or privately assigned.',
                        icon: Sliders,
                      },
                      {
                        title: 'Pricing Engine',
                        desc: 'Configure base daily tariffs, peak weekend surcharges, extra km fees, and night driving allowances.',
                        icon: DollarSign,
                      },
                      {
                        title: 'Unified Calendar',
                        desc: 'Visual timeline showing vehicle departure dates, expected return times, and turnaround gaps.',
                        icon: Calendar,
                      },
                      {
                        title: 'Customer Records',
                        desc: 'Pre-screened renter records with driving license copies, identity checks, and trip history.',
                        icon: Users,
                      },
                      {
                        title: 'Automated Invoices',
                        desc: 'Instant GST-compliant invoices and digital duty slips with starting & closing odometer logs.',
                        icon: FileText,
                      },
                      {
                        title: 'Fleet Analytics',
                        desc: 'Utilization percentages per car, highest earning models, and peak demand route analysis.',
                        icon: BarChart3,
                      },
                      {
                        title: 'Revenue Reports',
                        desc: 'Clear breakdown of gross earnings, platform commission, security deposit refunds, and net payouts.',
                        icon: Wallet,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 transition-all shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Earn More With Existing Fleet ─────────────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 sm:p-12 md:p-16 border border-slate-200/90 dark:border-slate-800 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl space-y-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold uppercase tracking-wider">
                        <TrendingUp size={13} />
                        <span>Maximum ROI</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                        Earn More With Existing Fleet
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                        Instead of waiting for customers to walk by your garage or hoping for random phone calls, showcase your vehicles to thousands of verified travelers searching through ApnaTrip every day.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                        {[
                          { title: 'Better utilization', desc: 'Turn idle weekdays into profitable booking days.' },
                          { title: 'More inquiries', desc: 'Direct booking requests from verified travelers.' },
                          { title: 'Repeat customers', desc: 'Loyal corporate and leisure travelers returning to you.' },
                          { title: 'Digital visibility', desc: 'Professional photos and specs visible across India.' },
                          { title: 'Verified profile', desc: 'Official platform badge that removes customer doubt.' },
                          { title: 'Professional image', desc: 'Automated invoices, duty slips, and digital contracts.' },
                        ].map((b, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold">
                              <CheckCircle2 size={14} />
                              <span>{b.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <a
                          href="https://app.apnatrip.in/rental/signup"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-teal-600/20"
                        >
                          <span>List Your Vehicles Now</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Slide: Why Rental Partners Choose ApnaTrip ───────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <ShieldCheck size={13} />
                      <span>Built For Fleet Success</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Why Rental Partners Choose ApnaTrip
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      We eliminate payment disputes, paper contracts, and unreliable customers with an engineered trust layer.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Easy vehicle management',
                        desc: 'Add, edit, or temporarily pause vehicles in seconds with zero complicated setup.',
                        icon: Car,
                      },
                      {
                        title: 'Verified customer ecosystem',
                        desc: 'Every renter undergoes government ID and phone pre-screening before booking.',
                        icon: ShieldCheck,
                      },
                      {
                        title: 'Transparent workflow',
                        desc: 'Clear upfront terms, zero hidden deductions, and complete control over your vehicle rules.',
                        icon: CheckCircle2,
                      },
                      {
                        title: 'Business insights',
                        desc: 'Identify your most profitable routes, peak weekend hours, and seasonal demand waves.',
                        icon: BarChart3,
                      },
                      {
                        title: 'Growth opportunities',
                        desc: 'Access corporate tie-ups and group tour contracts to expand your fleet confidently.',
                        icon: TrendingUp,
                      },
                      {
                        title: 'Technology support',
                        desc: 'Modern cloud infrastructure with real-time mobile alerts for every new inquiry.',
                        icon: Zap,
                      },
                      {
                        title: 'Dedicated assistance',
                        desc: 'Partner desk available 7 days a week to help resolve dispute or dispatch questions.',
                        icon: Headphones,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Slide: Rental Partner Onboarding (5 Steps) ───────────── */}
                <section className="container mx-auto px-4 max-w-6xl">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <Clock size={13} />
                      <span>Fast Deployment</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Rental Partner Onboarding
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      Go from garage lot to live online bookings in 5 simple verification steps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { step: '01', title: 'Register', desc: 'Create account with your fleet business details & phone.' },
                      { step: '02', title: 'Business Verification', desc: 'Verify trade license / GSTIN and owner KYC.' },
                      { step: '03', title: 'Vehicle Verification', desc: 'Upload RC copy, commercial permit & insurance.' },
                      { step: '04', title: 'Upload Fleet', desc: 'Add car photos, seating capacity & set per-km tariffs.' },
                      { step: '05', title: 'Receive Booking Requests', desc: 'Accept trip dispatches and receive daily settlements.' },
                    ].map((tl, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm relative"
                      >
                        <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                          {tl.step}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {tl.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {tl.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <a
                      href="https://app.apnatrip.in/rental/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Start Fleet Registration Now</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ================================================================= */}
        {/* FINAL SHARED SECTION: WHY CHOOSE APNATRIP & PITCH CLOSE           */}
        {/* ================================================================= */}
        <div className="container mx-auto px-4 max-w-6xl mt-32 space-y-24">
          {/* ── Slide: Traditional Methods vs ApnaTrip Comparison ──────────── */}
          <section>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sliders size={13} />
                <span>The Decisive Comparison</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Why Choose ApnaTrip?
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Compare traditional, manual methods with the modern technology ecosystem built for Indian travel entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Methods */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Old Way</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Traditional Methods</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'WhatsApp only', desc: 'Unorganized chats, missed leads, and no audit trail' },
                    { label: 'Phone calls', desc: 'Constant manual follow-ups for quotes and driver status' },
                    { label: 'Manual records', desc: 'Paper ledgers, lost receipts, and Excel calculation errors' },
                    { label: 'Limited reach', desc: 'Restricted to nearby neighborhood footfall and walk-ins' },
                    { label: 'No business insights', desc: 'Zero data on customer demographics or trending routes' },
                    { label: 'Difficult scaling', desc: 'Growing requires hiring large manual operations staff' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white">{item.label}:</strong>{' '}
                        <span className="text-slate-500 dark:text-slate-400">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ApnaTrip Platform */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-blue-100/50 dark:from-blue-950/70 dark:to-indigo-950 text-slate-900 dark:text-white border-2 border-blue-500/40 dark:border-blue-500/30 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="pb-4 border-b border-blue-200/80 dark:border-white/10">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">The Modern Standard</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">ApnaTrip Platform</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Professional business platform', desc: 'Centralized portal for itineraries, dispatches, and chats' },
                    { label: 'Verified profiles', desc: 'High-converting verified partner trust badge on all listings' },
                    { label: 'Smart dashboards', desc: 'Automated booking rosters, seat manifests, and calendars' },
                    { label: 'Customer management', desc: 'Integrated CRM with inquiry pipeline and instant quote builder' },
                    { label: 'Business analytics', desc: 'Clear visibility into conversion rates, views, and gross earnings' },
                    { label: 'Digital growth', desc: 'Pan-India search visibility with zero upfront engineering spend' },
                    { label: 'Technology powered', desc: 'Enterprise cloud infrastructure, secure escrow, and 24h settlements' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 size={18} className="text-blue-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white">{item.label}:</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Slide: Final Investor-Style Pitch CTA ───────────────────────── */}
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 text-slate-900 dark:text-white p-8 sm:p-14 md:p-20 border border-blue-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 dark:from-blue-600/15 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Next-Generation Travel Technology</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Ready to Grow Your Business?
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Join India&apos;s next-generation travel technology platform and grow with verified travelers, smart tools, and a professional digital presence.
              </p>

              {/* 3 Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="https://app.apnatrip.in/agency/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Building2 size={16} />
                  <span>Become an Agency Partner</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href="https://app.apnatrip.in/rental/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold shadow-lg shadow-teal-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Car size={16} />
                  <span>Become a Rental Partner</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href="tel:+919954060000"
                  className="px-7 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <PhoneCall size={16} />
                  <span>Talk to Sales (+91 9954060000)</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>100% Escrow Protection</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>24-Hour Digital Approval</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Headphones size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Dedicated Success Desk</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award size={16} className="text-purple-600 dark:text-purple-400" />
                  <span>Zero Upfront Risk</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
