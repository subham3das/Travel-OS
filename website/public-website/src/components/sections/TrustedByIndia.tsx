import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Car, Users, CheckCircle, Shield } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    count: '200+',
    label: 'Verified Travel Agencies',
    subtext: 'Directly registered & audited across 18 states',
  },
  {
    icon: Car,
    count: '120+',
    label: 'Vehicle Partners',
    subtext: 'Inspected self-drive & route transport providers',
  },
  {
    icon: Users,
    count: '50,000+',
    label: 'Travelers',
    subtext: 'Exploring India safely with verified operators',
  },
  {
    icon: CheckCircle,
    count: '10,000+',
    label: 'Successful Trips',
    subtext: 'Seamless journeys delivered with 4.9★ satisfaction',
  },
];

export default function TrustedByIndia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Shield size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Integrity First</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Trusted Across India
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Real partners, real verified credentials, and real travelers exploring the subcontinent.
          </p>
        </div>

        {/* 4 Trust Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.count}
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-base">
                  {stat.label}
                </div>
                <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stat.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
