import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  CheckCircle2,
  XCircle,
  Building2,
  Car,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Users,
  Compass,
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Lock,
  Check,
  Clock,
  Percent,
} from 'lucide-react';

const AGENCY_SIGNUP_URL = 'https://app.apnatrip.in/agency/signup';
const RENTAL_SIGNUP_URL = 'https://app.apnatrip.in/rental/signup';

const ONBOARDING_INCLUDES = [
  'Business Verification & Document KYC Audit',
  'Access to Partner Operating System & Dashboard',
  'Dedicated Digital Business Profile & Storefront',
  'Unlimited Priority Support During Onboarding',
  'Instant Catalog & Listing Activation',
  'Priority Setup & Listing Optimization Assistance',
];

const AGENCY_BENEFITS = [
  {
    icon: Users,
    title: 'More Customers',
    desc: 'Receive qualified direct inquiries from travelers who are actively planning trips and tours across India.',
  },
  {
    icon: Building2,
    title: 'Digital Business Profile',
    desc: 'A dedicated verified web page featuring your photo gallery, itinerary packages, company information, contact details, and trust badge.',
  },
  {
    icon: LayoutDashboard,
    title: 'Booking Management',
    desc: 'Seamlessly manage inbound customer leads, booking requests, package seat availability, payments, and trip execution status.',
  },
  {
    icon: ShieldCheck,
    title: 'Better Trust',
    desc: 'Our government GST, PAN, and tourism license audit awards your agency a Verified Partner Badge, eliminating traveler hesitation.',
  },
  {
    icon: Megaphone,
    title: 'Marketing Support',
    desc: 'Gain exposure through featured destination guides, homepage spotlights, priority search positioning, and seasonal campaigns.',
  },
  {
    icon: BarChart3,
    title: 'Business Insights',
    desc: 'Gain real-time intelligence on profile traffic, top-performing packages, booking conversion rates, and seasonal revenue trends.',
  },
];

const RENTAL_BENEFITS = [
  {
    icon: Compass,
    title: 'Receive More Bookings',
    desc: 'Connect your fleet with travelers searching for airport transfers, city local rides, outstation interstate trips, and self-drive explorations.',
  },
  {
    icon: Car,
    title: 'Fleet Management',
    desc: 'Effortlessly oversee live vehicle inventory, pricing grids, driver assignments, and a synchronized reservation calendar.',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    desc: 'Receive protected payouts through ApnaTrip’s milestone escrow workflow with zero deposit disputes or payout delays.',
  },
  {
    icon: Users,
    title: 'Verified Customers',
    desc: 'Protect your vehicles with mandatory customer digital KYC and identity checks before any car or key handover.',
  },
  {
    icon: TrendingUp,
    title: 'Reduce Idle Vehicles',
    desc: 'Maximize asset yield and daily return on investment by keeping your vehicles booked even during mid-week lull periods.',
  },
  {
    icon: LayoutDashboard,
    title: 'Business Dashboard',
    desc: 'Monitor all operations from a single pane of glass: active rentals, revenue settlements, vehicle health, and customer requests.',
  },
];

const FAQS = [
  {
    question: 'Is ₹1,000 charged every month?',
    answer: 'No. The ₹1,000 is a one-time onboarding and registration fee. There are no recurring monthly or yearly platform charges ever.',
  },
  {
    question: 'Is there any monthly subscription?',
    answer: 'No. We do not charge monthly or yearly subscription fees. We believe in earning only when our partners make money.',
  },
  {
    question: "Is commission charged if I don't receive bookings?",
    answer: 'No. If you do not receive any bookings, your fee is exactly ₹0. We only take a commission when you earn revenue.',
  },
  {
    question: 'When is commission deducted?',
    answer: 'Commission is only deducted after a successful booking is executed and completed. You keep 95% of every transaction.',
  },
  {
    question: 'Can I leave the platform anytime?',
    answer: 'Yes. There are zero lock-in contracts or penalties. You can pause or discontinue your listings whenever you wish.',
  },
  {
    question: 'Will I receive support during onboarding?',
    answer: 'Yes! Every partner is assigned a dedicated partner manager who assists with profile creation, documentation, and uploading your packages or vehicles.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Simple Partner Pricing — Travel Agencies & Car Rentals | ApnaTrip</title>
        <meta
          name="description"
          content="Simple, transparent pricing for travel agencies and vehicle rental fleet partners. ₹1,000 one-time onboarding fee. Zero commission for the first month. 5% only on successful bookings thereafter."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-24 selection:bg-blue-500 selection:text-white">
        {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4"
            >
              <Tag size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Partner Pricing & Plans</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Simple Pricing.
              <br />
              <span className="text-blue-600 dark:text-blue-400">Maximum Growth.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Join ApnaTrip with a small one-time onboarding fee and start receiving verified customer inquiries. No monthly subscription. No hidden charges.
            </motion.p>
          </div>

          {/* ── First Month Onboarding Cards (Agency & Rental) ─────────────── */}
          <div className="container mx-auto px-4 max-w-6xl mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Travel Agency Partners */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      <Building2 size={16} />
                      <span>Travel Agency Partners</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      Tours & Packages
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      First Month
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                        ₹1,000
                      </span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        One-Time Registration Fee
                      </span>
                    </div>
                  </div>

                  {/* Highlight Badge */}
                  <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>No Commission During First Month</span>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Includes:
                    </div>
                    {ONBOARDING_INCLUDES.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={17} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={AGENCY_SIGNUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Become an Agency Partner</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>

              {/* Card 2: Car Rental Partners */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
                      <Car size={16} />
                      <span>Car Rental Partners</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      Vehicles & Fleet
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      First Month
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                        ₹1,000
                      </span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        One-Time Registration Fee
                      </span>
                    </div>
                  </div>

                  {/* Highlight Badge */}
                  <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>No Commission During First Month</span>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Includes:
                    </div>
                    {ONBOARDING_INCLUDES.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={17} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={RENTAL_SIGNUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Become a Car Rental Partner</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── After First Month (Highlighted Pricing Card) ──────────────── */}
          <div className="container mx-auto px-4 max-w-4xl mt-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/80 dark:from-blue-950/70 dark:via-slate-900 dark:to-indigo-950 border-2 border-blue-500/40 dark:border-blue-500/40 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-blue-200/70 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Clock size={13} />
                    <span>After First Month</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Platform Commission
                  </h3>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-3xl sm:text-5xl font-black text-blue-600 dark:text-blue-400">
                    5%
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Only On Successful Bookings
                  </div>
                </div>
              </div>

              {/* Clear bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
                {[
                  'No monthly subscription',
                  'No yearly subscription',
                  'No listing renewal fee',
                  'No charge if you receive no bookings',
                  'Commission is deducted only after a successful completed booking',
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={13} />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Highlighted Note */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-600 text-white text-center shadow-lg shadow-blue-600/20">
                <p className="text-base sm:text-lg font-bold tracking-tight">
                  &ldquo;You earn first. We earn only when you earn.&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. Agency Partner Benefits Section ──────────────────────────── */}
        <section className="py-20 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
                <Building2 size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Agency Partner Benefits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Everything You Need To Grow Your Travel Business
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Turn your local destination mastery into recurring revenue with professional digital tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AGENCY_BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Car Rental Partner Benefits Section ──────────────────────── */}
        <section className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
                <Car size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Car Rental Partner Benefits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Grow Your Vehicle Rental Business
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Eliminate dead fleet mileage and connect directly with verified interstate and outstation travelers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RENTAL_BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. Why Our Pricing Works (Comparison Cards) ─────────────────── */}
        <section className="py-20 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <BarChart3 size={13} />
                <span>Fair Comparison</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Why Our Pricing Works
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Old-fashioned travel classifieds drain your profits with upfront fees regardless of outcome. ApnaTrip aligns incentives with yours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Listing Platforms */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Traditional Listing Platforms
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                    <XCircle size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    'High monthly fees',
                    'Hidden charges',
                    'Pay even without bookings',
                    'Limited support',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <XCircle size={16} className="text-rose-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ApnaTrip Platform */}
              <div className="relative p-8 sm:p-10 rounded-3xl bg-blue-50/70 dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-xl space-y-6">
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  Recommended
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-blue-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    ApnaTrip
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    '₹1,000 onboarding only',
                    'No commission during first month',
                    'Only 5% after successful bookings',
                    'No bookings = No commission',
                    'Dedicated onboarding support',
                    'Business growth tools included',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Example Earnings (Infographic) ────────────────────────────── */}
        <section className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Percent size={13} />
                <span>Transparent Math</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Example Earnings
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                See exactly how much you take home after each successful booking transaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Example 1: Agency */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
                    <Building2 size={14} />
                    <span>Example Agency</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Monthly Sales
                      </span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₹2,00,000
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Platform Commission (5%)
                      </span>
                      <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                        ₹10,000
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 bg-emerald-50 dark:bg-emerald-950/40 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
                      <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        Agency Keeps
                      </span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        ₹1,90,000
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    You keep 95% of every successful booking.
                  </p>
                </div>
              </div>

              {/* Example 2: Car Rental Partner */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-xs font-bold mb-4">
                    <Car size={14} />
                    <span>Example Car Rental Partner</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Monthly Booking Revenue
                      </span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₹1,50,000
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Platform Commission (5%)
                      </span>
                      <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                        ₹7,500
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 bg-emerald-50 dark:bg-emerald-950/40 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
                      <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        Partner Keeps
                      </span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        ₹1,42,500
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    You keep 95% of every successful booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Frequently Asked Questions (Accordion) ────────────────────── */}
        <section className="py-20 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <HelpCircle size={13} />
                <span>Common Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Everything you need to know about ApnaTrip partner pricing and onboarding fees.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. Final Premium CTA ────────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-12">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 md:p-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Zero Hidden Fees</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Ready To Grow With ApnaTrip?
              </h2>

              <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Join hundreds of future travel businesses building their digital presence with ApnaTrip.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={AGENCY_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <Building2 size={16} />
                  <span>Become an Agency Partner</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href={RENTAL_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5"
                >
                  <Car size={16} />
                  <span>Become a Car Rental Partner</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
