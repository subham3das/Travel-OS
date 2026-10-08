import { Star, ShieldCheck, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Rahul Sharma',
    city: 'Delhi',
    trip: '7-Day Meghalaya & Cherrapunji Expedition',
    text: 'Booked my Meghalaya trip through ApnaTrip. The agency was fully verified and the milestone escrow payment meant I had zero worry about advance deposits. Everything was perfectly managed.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80',
  },
  {
    name: 'Sneha Patil',
    city: 'Pune',
    trip: 'Self-Drive SUV Rental in Spiti',
    text: 'The verification process made me trust the agency instantly. We picked up a clean 4x4 Thar in Shimla with zero deposit surprises. Digital inspection on the app was smooth.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
  },
  {
    name: 'Ankita Das',
    city: 'Guwahati',
    trip: 'Majuli Island Cultural Tour',
    text: 'The community helped me find amazing travel partners for our trip to Majuli. Connecting directly with native Assamese operators who know every secret trail made all the difference.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
  },
  {
    name: 'Rohit Jain',
    city: 'Jaipur',
    trip: 'Ladakh High Passes Road Journey',
    text: 'Very smooth booking experience. Professional agencies, clear communication on oxygen acclimation, and prompt customer assistance when our flight to Leh was rescheduled.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span>Verified Traveler Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Stories from Fellow Explorers
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Real feedback from verified travelers who completed journeys with ApnaTrip partner operators.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, s) => (
                      <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote size={20} className="text-blue-300 dark:text-blue-900" />
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  "{r.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                    <span>{r.name}</span>
                    <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.city} · <span className="text-blue-600 dark:text-blue-400">{r.trip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
