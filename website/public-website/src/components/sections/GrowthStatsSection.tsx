import { TrendingUp, Award, Users, Building2 } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    badge: 'Integrity',
    title: 'Verified Partner Network',
    desc: 'Pre-screened travel agencies and licensed operators audited for safety, GST compliance, and tourism credentials.',
  },
  {
    icon: TrendingUp,
    badge: 'Expansion',
    title: 'Growing Across India',
    desc: 'Expanding technology footprint connecting regional tourist circuits, mountain corridors, and transit hubs.',
  },
  {
    icon: Users,
    badge: 'Coverage',
    title: 'Expanding Destination Network',
    desc: 'Connecting authentic travelers with verified local experts, cultural tours, and customized travel itineraries.',
  },
  {
    icon: Award,
    badge: 'Security',
    title: 'Trusted Technology Platform',
    desc: 'Bank-grade milestone escrow protection, digital KYC identity, and end-to-end partner operations management.',
  },
];

export default function GrowthStatsSection() {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/60 border border-blue-400/30 text-white text-xs font-semibold mb-3">
            <TrendingUp size={14} className="text-teal-300" />
            <span>Built on Trust & Technology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Connecting India's Travel Ecosystem
          </h2>
          <p className="mt-3 text-blue-100 text-sm md:text-base">
            Standardizing trust, safety, and operational excellence for agencies, vehicle partners, and explorers nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-blue-700/40 border border-blue-400/20 backdrop-blur-xs flex flex-col justify-between hover:bg-blue-700/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-800/80 flex items-center justify-center text-teal-300">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-800/60 text-teal-200">
                      {s.badge}
                    </span>
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
                    {s.title}
                  </div>
                </div>
                <p className="mt-4 text-xs text-blue-100/90 leading-relaxed border-t border-blue-500/30 pt-3">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
