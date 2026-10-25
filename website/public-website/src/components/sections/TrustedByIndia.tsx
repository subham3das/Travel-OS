import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Car, Users, Shield } from 'lucide-react';

const pillars = [
  {
    icon: Building2,
    badge: 'Audited Partners',
    title: 'Verified Partner Network',
    subtext: 'Strict document verification, GST compliance, and tourism license vetting for every agency.',
  },
  {
    icon: Car,
    badge: 'Pan-India Footprint',
    title: 'Growing Across India',
    subtext: 'Expanding footprint across major airport circuits, mountain routes, and cultural corridors.',
  },
  {
    icon: Users,
    badge: 'Curated Trails',
    title: 'Expanding Destination Network',
    subtext: 'Authentic local itineraries crafted by native specialists with transparent direct coordination.',
  },
  {
    icon: Shield,
    badge: 'Financial Safety',
    title: 'Trusted Technology Platform',
    subtext: '100% milestone escrow fund protection, digital KYC identity, and 24×7 incident assistance.',
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
            A verified ecosystem connecting travelers with authentic local operators, safe routes, and secure technology.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      {pillar.badge}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                    {pillar.title}
                  </div>
                </div>
                <p className="mt-3 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  {pillar.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
