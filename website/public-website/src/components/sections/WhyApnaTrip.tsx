import {
  ShieldCheck,
  CreditCard,
  UserCheck,
  Lock,
  Users2,
  Headphones,
  Compass,
  Car,
} from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Agencies',
    description:
      'Every agency must pass physical verification, GST audits, and tourism license checks before listing a single tour.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description:
      'Bank-grade escrow releases your funds to agencies in milestones only after tour check-ins are validated.',
  },
  {
    icon: UserCheck,
    title: 'One-Time Travel Profile',
    description:
      'Verify your ID once. Seamlessly book with dozens of agencies and rental fleets without submitting documents repeatedly.',
  },
  {
    icon: Lock,
    title: 'KYC Protection',
    description:
      'Encrypted personal data and traveler identity masking protect your privacy from unsolicited third-party solicitations.',
  },
  {
    icon: Users2,
    title: 'WhatsApp Community',
    description:
      'Join the official ApnaTrip WhatsApp Communities to get verified travel updates, destination tips, group trip notifications, and connect with fellow travelers across India.',
  },
  {
    icon: Headphones,
    title: '24×7 Human Support',
    description:
      'Real emergency travel concierges located across India ready to assist with route issues, delays, or medical needs.',
  },
  {
    icon: Compass,
    title: 'Fixed Route Booking',
    description:
      'Pre-scheduled intercity cabs on vital mountain and highway routes with zero last-minute surge pricing.',
  },
  {
    icon: Car,
    title: 'Verified Vehicle Rentals',
    description:
      'Hassle-free self-drive cars and motorcycles with transparent zero-deposit digital vehicle condition checkouts.',
  },
];

export default function WhyApnaTrip() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <span>Built on Real Accountability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Travelers Choose ApnaTrip
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            No algorithms replacing human care. Just rock-solid verification, financial protection, and local expertise.
          </p>
        </div>

        {/* 9 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className="group p-7 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
