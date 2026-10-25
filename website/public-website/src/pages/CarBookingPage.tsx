import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car,
  Route,
  Plane,
  Building,
  Navigation,
  Clock,
  Calendar,
  Compass,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function CarBookingPage() {
  return (
    <>
      <Helmet>
        <title>Car & Rentals — Ground Mobility Ecosystem | ApnaTrip</title>
        <meta
          name="description"
          content="Learn how ApnaTrip ground mobility works. Fixed-route travel, flexible self-drive rentals, and professional driver services with verified vehicles and transparent standards."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-24">
        {/* Hero Section */}
        <div className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4"
            >
              <Car size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Ground Mobility Ecosystem</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Car & Rentals
              <br />
              <span className="text-blue-600 dark:text-blue-400">Verified Ground Mobility</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Learn how ApnaTrip powers seamless ground transport across India. From scheduled fixed-route intercity transfers to self-drive freedom and professional driver travel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <a
                href="https://app.apnatrip.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto px-7 py-3 text-sm rounded-xl"
              >
                <span>View Site</span>
                <ExternalLink size={15} />
              </a>
              <Link to="/partner" className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm rounded-xl">
                <span>Become a Rental Partner</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl space-y-24 mt-4">
          {/* ── Section 1: Fixed Route Travel ─────────────────────────────────── */}
          <section className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Route size={13} />
                <span>Pillar 01</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fixed Route Travel
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Standardized transit corridors with pre-calculated transparent pricing, guaranteed departure windows, and commercial passenger permits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Airport Transfers */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                    <Plane size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Airport Transfers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Reliable airport pickups and drop-offs designed to eliminate curb-side haggling and terminal confusion.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Live flight delay tracking with automated pickup adjustment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Meet-and-greet greeting with dedicated baggage assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Pre-negotiated terminal parking & toll inclusions</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* City Transfers */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                    <Building size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    City Transfers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Point-to-point urban transit connecting transit railway hubs, central business districts, and suburban hotels.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Direct station-to-hotel transit with zero mid-route detours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Clean, air-conditioned sedans and spacious MPVs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Zero peak-hour surge multipliers on verified routes</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Intercity Travel */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                    <Navigation size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Intercity Travel
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Long-distance highway travel and mountain corridor connections between tourist destinations.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Established circuits (e.g., Guwahati ↔ Shillong, Dehradun ↔ Mussoorie)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Interstate road tax and passenger permit compliance handled upfront</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Curated hygienic highway rest stops and meal halts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2: Self Drive Rentals ─────────────────────────────────── */}
          <section className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Car size={13} />
                <span>Pillar 02</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Self Drive Rentals
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Complete freedom to drive on your own terms. Verified fleet partners provide well-maintained vehicles with digital inspection check-in and zero deposit friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hourly Rentals */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Hourly Rentals
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Designed for quick city appointments, shopping runs, or brief excursions without full-day commitments.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Flexible packages starting from 4 to 8 hour blocks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Instant digital extension via the web app if plans change</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Ideal for compact hatchbacks and electric city vehicles</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Daily Rentals */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Daily Rentals
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Full 24-hour cycles for exploring coastal drives, hill station viewpoints, and heritage circuits.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Generous complimentary daily mileage allowances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Comprehensive vehicle handover inspection with photo audit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Doorstep delivery available at major hotels and transit hubs</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Weekend Rentals */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                    <Compass size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Weekend Rentals
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Multi-day road trip packages tailored for weekend breaks, mountain expeditions, and group getaways.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>Bundled multi-day packages with unlimited or high-mileage caps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>4x4 SUVs, rugged MPVs, and adventure touring motorcycles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>24×7 roadside breakdown assistance across national corridors</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: Professional Driver Service ─────────────────────────── */}
          <section className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <UserCheck size={13} />
                <span>Pillar 03</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Professional Driver Service
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Travel with total peace of mind. Experienced, background-verified professional drivers who understand terrain nuances, passenger safety, and local routes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                  Verified Commercial Badges
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every driver holds a valid commercial transport badge, clean driving record, police verification, and commercial vehicle passenger insurance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Navigation size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                  Mountain & Terrain Expertise
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Skilled in navigating difficult hairpin curves, snow passes, fog corridors, and seasonal monsoon road conditions across Indian terrains.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                  Professional Etiquette
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Trained in courteous guest interaction, luggage assistance, transparent communication, and patient navigation without rash driving.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                  Punctuality & Safety
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Guaranteed reporting 15 minutes before departure, vehicle sanitization, functioning seatbelts, and working mobile charging points.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 4: Technology & Standards ─────────────────────────────── */}
          <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  <Lock size={13} />
                  <span>Verified Technology Standard</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  How ApnaTrip Ensures Vehicle Safety & Fair Practices
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Ground mobility partners on ApnaTrip adhere to standardized digital check-ins, transparent escrow payments, and mandatory document verification.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong>12-Point Inspection:</strong> Timestamped photos taken at handover to eliminate scratch disputes.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong>Milestone Escrow:</strong> Driver compensation settled post-trip to prevent advance loss.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong>Live Telemetry:</strong> Shared route link and emergency SOS button for family reassurance.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong>Zero Hidden Surcharges:</strong> Standardized flat quotes covering toll, state entry, and driver allowance.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <a
                  href="https://app.apnatrip.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-3.5 text-center text-sm font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <span>View Site to Explore Mobility</span>
                  <ExternalLink size={15} />
                </a>
                <Link
                  to="/partner"
                  className="w-full py-3 text-center text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300/80 dark:border-slate-700 rounded-xl transition-all shadow-xs"
                >
                  Own Vehicles? Register as a Rental Partner
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
