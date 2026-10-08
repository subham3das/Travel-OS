import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Compass, Car, Sparkles } from 'lucide-react';

const MountainValleyCanvas = lazy(() => import('../three/MountainValleyCanvas'));

const trustBadges = [
  { icon: ShieldCheck, title: 'Verified Agency', desc: 'Direct, licensed local operators' },
  { icon: CheckCircle2, title: 'Secure Payments', desc: '100% escrow protected milestones' },
  { icon: UserCheck, title: 'KYC Verified Travelers', desc: 'Safe & trusted community' },
  { icon: Compass, title: 'Route Booking', desc: 'Fixed & shared intercity routes' },
  { icon: Car, title: 'Self Drive Rentals', desc: 'Cars & bikes with zero deposit' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* 3D Mountain Valley & Atmospheric Canvas */}
      <Suspense fallback={null}>
        <MountainValleyCanvas />
      </Suspense>

      {/* Gentle morning light gradient backdrops */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100/40 dark:from-blue-950/20 to-transparent pointer-events-none" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-200/20 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-semibold mb-6 shadow-xs"
        >
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
          <span>Trusted Travel Platform for India</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
        >
          Discover destinations.
          <br />
          <span className="text-blue-600 dark:text-blue-400">Connect with verified agencies.</span>
          <br />
          Travel with confidence.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          India's unified travel ecosystem bringing together authentic travelers, verified tour operators, route transport, and vehicle partners under one secure umbrella.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/destinations" className="btn-primary w-full sm:w-auto px-7 py-3.5 text-base">
            <span>Explore Destinations</span>
            <ArrowRight size={17} />
          </Link>
          <Link to="/partner" className="btn-secondary w-full sm:w-auto px-7 py-3.5 text-base">
            <span>Become a Partner</span>
          </Link>
        </motion.div>

        {/* Floating Trust Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-5">
            Built on Complete Transparency & Trust
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 text-left cursor-default hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {badge.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                    {badge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
