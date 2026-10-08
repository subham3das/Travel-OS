import { Users2, MessageCircle, MapPin, Calendar, Compass, ArrowRight, ExternalLink } from 'lucide-react';

const communityBenefits = [
  {
    icon: '🗺️',
    title: 'Destination Recommendations',
    desc: 'Get honest local tips from travelers who have actually been there — before you book.',
  },
  {
    icon: '📢',
    title: 'Verified Travel Updates',
    desc: 'Real-time road conditions, weather alerts, permit changes, and agency announcements.',
  },
  {
    icon: '👥',
    title: 'Group Trip Notifications',
    desc: 'Find out about upcoming group departures, shared cabs, and open expedition slots.',
  },
  {
    icon: '❓',
    title: 'Travel Q&A',
    desc: 'Ask route questions, packing queries, or permit doubts and get answers from the community.',
  },
  {
    icon: '🏢',
    title: 'Agency Announcements',
    desc: 'Verified agencies share availability, last-minute openings, and seasonal discounts directly.',
  },
  {
    icon: '📍',
    title: 'Local Travel Tips',
    desc: 'Region-specific advice from explorers who know the terrain, weather, and road conditions.',
  },
];

const upcomingGroupTrips = [
  { title: 'Western Ghats Monsoon Trail', date: 'Jul 18 – 20', slots: '6 slots open' },
  { title: 'Zanskar Valley Expedition', date: 'Aug 05 – 12', slots: '4 slots open' },
  { title: 'Kaziranga Wildlife Safari', date: 'Nov 14 – 18', slots: '8 slots open' },
];

export default function CommunitySection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Users2 size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Official WhatsApp Communities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            The ApnaTrip Traveler Community
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Connect with fellow travelers, get verified updates, and stay informed — through the official ApnaTrip WhatsApp Communities.
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            The ApnaTrip Community currently operates through official WhatsApp Communities.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Left Column: Community Benefits */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass size={18} className="text-blue-600 dark:text-blue-400" />
                <span>What You Get in the Community</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0">{benefit.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{benefit.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Join CTA */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Join the WhatsApp Community</h4>
                <p className="text-blue-100 text-xs mt-0.5">Free to join. Real travelers. No spam.</p>
              </div>
              <a
                href="https://app.apnatrip.in/community"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors shrink-0"
              >
                <MessageCircle size={15} />
                Join Now
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Right Column: Upcoming Group Trips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Group Trips */}
            <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                <span>Upcoming Group Trips</span>
              </h3>
              <div className="space-y-3">
                {upcomingGroupTrips.map((trip, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {trip.title}
                    </h5>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={11} />{trip.date}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{trip.slots}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Group trip details are announced in the WhatsApp Community first.
              </p>
            </div>

            {/* Quick stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-teal-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-200/60 dark:border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📡</span> Community Activity
              </h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Active travelers</span>
                  <span className="font-bold text-slate-900 dark:text-white">Growing daily</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>States covered</span>
                  <span className="font-bold text-slate-900 dark:text-white">28+ states</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform</span>
                  <span className="font-bold text-green-600">WhatsApp</span>
                </div>
              </div>
              <a
                href="https://app.apnatrip.in/community"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                <span>Join ApnaTrip Community</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
