import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudSun, Calendar, MapPin } from 'lucide-react';

const destinations = [
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    state: 'North East India',
    category: 'North East',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80',
    weather: '18°C · Pleasant',
    bestSeason: 'Oct – May',
    highlights: 'Double Decker Living Root Bridges, Dawki crystal river, Cherrapunji waterfalls',
    operators: '34 Verified Agencies',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Jammu & Kashmir',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
    weather: '12°C · Crisp Sky',
    bestSeason: 'May – Sep',
    highlights: 'Pangong Tso, Khardung La Pass, Nubra Valley sand dunes & monasteries',
    operators: '28 Verified Agencies',
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters',
    state: 'Kerala',
    category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    weather: '27°C · Tropical',
    bestSeason: 'Sep – Mar',
    highlights: 'Alleppey private houseboats, Munnar tea gardens, Varkala cliff beach',
    operators: '42 Verified Agencies',
  },
  {
    id: 'assam',
    name: 'Kaziranga & Majuli',
    state: 'Assam',
    category: 'North East',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&q=80',
    weather: '22°C · Mild Breeze',
    bestSeason: 'Nov – Apr',
    highlights: 'One-horned rhino safari, Brahmaputra river island, ancient Satras',
    operators: '21 Verified Agencies',
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    weather: '8°C · Mountain Chill',
    bestSeason: 'Jun – Oct',
    highlights: 'Key Monastery, Chandratal Lake, highest post office in Hikkim',
    operators: '19 Verified Agencies',
  },
  {
    id: 'goa',
    name: 'South Goa Coastline',
    state: 'Goa',
    category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    weather: '29°C · Sunny',
    bestSeason: 'Nov – Feb',
    highlights: 'Palolem serene bay, Cabo de Rama fort, spice plantations, quiet shores',
    operators: '36 Verified Agencies',
  },
];

export default function DestinationsShowcase() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? destinations
    : destinations.filter((d) => d.category === filter);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Authentic India</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Featured Indian Destinations
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base max-w-xl">
              Curated regions with licensed local operators, verified homestays, and established route transit.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-start md:self-end">
            {['All', 'Mountains', 'North East', 'Beaches'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image with zoom and badges */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-800">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-semibold">
                      {dest.category}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold">
                      {dest.operators}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs text-blue-200 font-medium">{dest.state}</span>
                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {dest.highlights}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <CloudSun size={14} className="text-blue-500 shrink-0" />
                      <span>{dest.weather}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Calendar size={14} className="text-blue-500 shrink-0" />
                      <span>Best: {dest.bestSeason}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/destinations?region=${dest.id}`}
                  className="w-full py-2.5 rounded-xl border border-blue-600/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white"
                >
                  <span>Explore Verified Packages</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Link */}
        <div className="mt-12 text-center">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All 200+ Indian Destinations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
