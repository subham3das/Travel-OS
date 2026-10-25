import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Compass, Sparkles, X, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  state: string;
  category: 'Mountains' | 'Beaches' | 'Heritage' | 'North East' | 'Nature';
  image: string;
  emoji: string;
  shortDesc: string;
  whyVisit: string;
  bestSeason: string;
  attractions: string[];
  travelPointers: string[];
}

const destinations: Destination[] = [
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format',
    emoji: '🏔️',
    shortDesc: 'A Himalayan gateway flanked by high pine forests, raging rivers, and snow-dusted alpine passes.',
    whyVisit: 'Ideal for year-round mountain exploration, crisp pine air, riverside retreats, and high-altitude highway access.',
    bestSeason: 'October to June',
    attractions: ['Solang Valley', 'Rohtang Pass', 'Old Manali Cafés', 'Hadimba Temple', 'Jogini Waterfalls'],
    travelPointers: [
      'Accessible via direct scenic route transit from Chandigarh and Delhi.',
      'Verified local operators provide guided day excursions and winter permits.',
      'Equipped with verified cab and self-drive vehicle partners.',
    ],
  },
  {
    id: 'ladakh',
    name: 'Leh Ladakh',
    state: 'Jammu & Kashmir',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1591790308747-2f56a2fe50d0?w=800&q=80&auto=format',
    emoji: '🏔️',
    shortDesc: 'High-altitude desert wonderland featuring azure salt lakes, ancient monasteries, and stark mountain valleys.',
    whyVisit: 'Witness breathtaking trans-Himalayan landscapes, star-studded dark skies, and rich Buddhist heritage.',
    bestSeason: 'May to September',
    attractions: ['Pangong Tso', 'Nubra Valley', 'Khardung La Pass', 'Thiksey Monastery', 'Magnetic Hill'],
    travelPointers: [
      'Strict 48-hour acclimatization is required upon landing in Leh.',
      'Inner Line Permits (ILP) required for Nubra Valley and Pangong Tso.',
      'Local transport managed by regional commercial union drivers.',
    ],
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya & Cherrapunji',
    state: 'North East India',
    category: 'North East',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80&auto=format',
    emoji: '🌿',
    shortDesc: 'The abode of clouds, famous for crystal-clear rivers, living root bridges, and deep limestone caverns.',
    whyVisit: 'Immerse in indigenous Khasi culture, lush rainfall trails, and untouched natural wonders.',
    bestSeason: 'October to May',
    attractions: ['Double Decker Root Bridge', 'Dawki Umngot River', 'Nohkalikai Falls', 'Mawsmai Caves', 'Mawlynnong Village'],
    travelPointers: [
      'Direct highway cab route from Guwahati Airport (GAU) takes ~3.5 hours.',
      'Local guides are essential for root bridge trekking in Nongriat.',
      'Cleanest villages and community-managed eco-stays.',
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters',
    state: 'Kerala',
    category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80&auto=format',
    emoji: '🌴',
    shortDesc: 'Palm-fringed coastal canals, serene houseboats, misty spice hills, and pristine Ayurvedic retreats.',
    whyVisit: 'Experience peaceful slow travel through winding lagoons, lush tea plantations, and rich performing arts.',
    bestSeason: 'September to March',
    attractions: ['Alleppey Houseboat Canals', 'Munnar Tea Gardens', 'Varkala Cliff Beach', 'Periyar Wildlife Sanctuary', 'Fort Kochi'],
    travelPointers: [
      'Verified government-registered houseboats maintain environmental safety standards.',
      'Airport connectivity via Cochin International Airport (COK).',
      'Smooth intercity cab routes connecting coastal towns and hill stations.',
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Heritage Circuit',
    state: 'Rajasthan',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1667819943948-f21e1f3e4284?w=800&q=80&auto=format',
    emoji: '🏰',
    shortDesc: 'Legendary royal forts, marble palaces, desert dunes, and vibrant cultural markets.',
    whyVisit: 'Explore centuries of regal architecture, folk traditions, colorful bazaars, and golden sunset safaris.',
    bestSeason: 'October to March',
    attractions: ['Amber Fort (Jaipur)', 'Lake Pichola (Udaipur)', 'Mehrangarh Fort (Jodhpur)', 'Sam Sand Dunes (Jaisalmer)', 'Pushkar Lake'],
    travelPointers: [
      'Intercity golden triangle corridors with excellent multi-lane highways.',
      'Verified heritage properties and registered tourism guides available.',
      'Chauffeur-driven vehicles recommended for multi-city desert tours.',
    ],
  },
  {
    id: 'goa',
    name: 'Goa Coastline',
    state: 'Goa',
    category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80&auto=format',
    emoji: '🌊',
    shortDesc: 'Sun-drenched Arabian Sea coastline blending Portuguese heritage, seaside dining, and quiet backwaters.',
    whyVisit: 'Enjoy peaceful South Goa beaches, water sports, spice plantations, and historic Latin quarter architecture.',
    bestSeason: 'November to February',
    attractions: ['Palolem & Agonda Beaches', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls', 'Fort Aguada', 'Divar Island'],
    travelPointers: [
      'Self-drive rental cars and two-wheelers with digital checklists available across hubs.',
      'Dual airport connectivity via Dabolim (GOI) and Manohar Mopa (GOX).',
      'South Goa offers tranquil nature, while North Goa has lively markets.',
    ],
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format',
    emoji: '🗻',
    shortDesc: 'The middle land between India and Tibet, showcasing rugged lunar valleys, high monasteries, and fossil villages.',
    whyVisit: 'A thrilling high-altitude road journey for true adventure seekers and lovers of ancient monastic culture.',
    bestSeason: 'June to October',
    attractions: ['Key Monastery', 'Chandratal Lake', 'Hikkim Highest Post Office', 'Komic Village', 'Pin Valley National Park'],
    travelPointers: [
      'High ground clearance 4x4 or rugged SUV vehicle strongly recommended.',
      'Enter via Shimla route for gradual and safe acclimatization.',
      'Homestays run by welcoming local families with authentic Spitian cuisine.',
    ],
  },
  {
    id: 'andaman',
    name: 'Andaman & Nicobar Islands',
    state: 'Island Territory',
    category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format',
    emoji: '🏝️',
    shortDesc: 'Tropical archipelago surrounded by turquoise waters, coral reefs, and dense virgin rainforests.',
    whyVisit: 'World-class scuba diving, pristine white sand beaches, and deeply poignant colonial history.',
    bestSeason: 'October to May',
    attractions: ['Radhanagar Beach (Havelock)', 'Cellular Jail (Port Blair)', 'Elephant Beach Snorkeling', 'Neil Island Coral Bridge', 'Baratang Mangroves'],
    travelPointers: [
      'Inter-island passenger ferries require advance government scheduling.',
      'Environmental conservation laws strictly protect coral reefs and marine life.',
      'Verified local operators assist with permit coordination and transfers.',
    ],
  },
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1605457867610-e990b192553e?w=800&q=80&auto=format',
    emoji: '☕',
    shortDesc: 'Rolling Western Ghats highlands carpeted in fragrant coffee plantations, pepper vines, and misty streams.',
    whyVisit: 'The Scotland of India offers serene plantation homestays, trekking trails, and distinct Kodava cuisine.',
    bestSeason: 'October to April',
    attractions: ['Abbey Falls', 'Raja’s Seat Viewpoint', 'Coffee Estate Trails', 'Talakaveri Source', 'Dubare Elephant Camp'],
    travelPointers: [
      'Convenient road drive from Bengaluru (~5.5 hrs) or Mysuru (~2.5 hrs).',
      'Ideal for refreshing weekend self-drive getaways or family retreats.',
      'Verified homestays offer authentic plantation tours and estate hospitality.',
    ],
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1561361058-c24e01b35ded?w=800&q=80&auto=format',
    emoji: '🪔',
    shortDesc: 'One of the oldest continuously inhabited cities on Earth, pulsating along the sacred banks of the Ganges.',
    whyVisit: 'Experience hypnotic evening Ganga Aartis, historic labyrinthine alleys, silk weaving, and spiritual heritage.',
    bestSeason: 'October to March',
    attractions: ['Dashashwamedh Ghat Aarti', 'Kashi Vishwanath Corridor', 'Morning Sunrise Boat Ride', 'Sarnath Buddhist Stupa', 'Assi Ghat'],
    travelPointers: [
      'Walking and e-rickshaws are best for exploring the narrow heritage lanes.',
      'Sunrise boat rides along the ghats offer spectacular photographic light.',
      'Direct high-speed rail and airport connectivity.',
    ],
  },
  {
    id: 'assam',
    name: 'Kaziranga & Majuli',
    state: 'Assam',
    category: 'North East',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&q=80&auto=format',
    emoji: '🦏',
    shortDesc: 'Floodplain wetlands home to the great one-horned rhinoceros and the world’s largest inhabited river island.',
    whyVisit: 'Encounter rare wildlife up close and discover centuries-old Neo-Vaishnavite monasteries on Majuli Island.',
    bestSeason: 'November to April',
    attractions: ['Kaziranga National Park Safari', 'Majuli Island Satras', 'Brahmaputra River Sunset', 'Orchid & Biodiversity Park', 'Tea Gardens'],
    travelPointers: [
      'Safaris are operated by certified forest department drivers and naturalists.',
      'Majuli is accessible via river ferries from Nimati Ghat, Jorhat.',
      'Rich tribal handloom and organic culinary heritage.',
    ],
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh & Haridwar',
    state: 'Uttarakhand',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80&auto=format',
    emoji: '🕉️',
    shortDesc: 'The yoga capital of the world resting where the clear turquoise Ganges emerges from the lower Himalayas.',
    whyVisit: 'Combine tranquil ashram meditation and riverside aartis with white-water rafting and mountain hikes.',
    bestSeason: 'September to May',
    attractions: ['Triveni Ghat Evening Aarti', 'Ram & Lakshman Jhula', 'Ganges River Rafting', 'Beatles Ashram', 'Neelkanth Mahadev'],
    travelPointers: [
      'Accessible in ~4.5 hours from Delhi via national expressways or direct rail.',
      'Verified local adventure operators conduct certified river rafting excursions.',
      'Gateway to the Garhwal Himalayan trekking trails and Char Dham circuits.',
    ],
  },
];

const categories = ['All', 'Mountains', 'Beaches', 'Heritage', 'North East', 'Nature'] as const;

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  const filtered = selectedCategory === 'All'
    ? destinations
    : destinations.filter(d => d.category === selectedCategory);

  useEffect(() => {
    if (activeModalDest) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveModalDest(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeModalDest]);

  return (
    <>
      <Helmet>
        <title>Destination Showcase — ApnaTrip</title>
        <meta
          name="description"
          content="Explore India's breathtaking destinations with verified local operators and transparent technology. Pure destination showcase with zero booking friction."
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
              <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Destination Showcase</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              India's Breathtaking
              <br />
              <span className="text-blue-600 dark:text-blue-400">Destination Showcase</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Explore iconic regions and hidden gems across India, designed to be discovered through licensed local operators, verified drivers, and transparent travel technology.
            </motion.p>

            {/* Informational Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 right-3 text-2xl filter drop-shadow-md">
                      {dest.emoji}
                    </span>

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                      {dest.category}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-xs font-medium text-blue-200">{dest.state}</span>
                      <h3 className="text-xl font-bold leading-tight mt-0.5">{dest.name}</h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    {/* Short description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dest.shortDesc}
                    </p>

                    {/* Why Visit */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                        <Sparkles size={12} />
                        <span>Why Visit</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                        {dest.whyVisit}
                      </p>
                    </div>

                    {/* Season & Attractions */}
                    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar size={13} className="text-blue-500 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Best Season:</span>
                        <span>{dest.bestSeason}</span>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                          <Compass size={13} className="text-blue-500" />
                          <span>Famous Attractions:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.attractions.slice(0, 3).map((attr) => (
                            <span
                              key={attr}
                              className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {attr}
                            </span>
                          ))}
                          {dest.attractions.length > 3 && (
                            <span className="px-2 py-0.5 text-[11px] rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium">
                              +{dest.attractions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Button: Pure informational trigger */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setActiveModalDest(dest)}
                    className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs group-hover:bg-blue-600 group-hover:text-white"
                  >
                    <span>View Destination</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal: Full Destination Information View */}
        <AnimatePresence>
          {activeModalDest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModalDest(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
              >
                {/* Floating Frosted Close Button - Stays fixed and always visible */}
                <button
                  onClick={() => setActiveModalDest(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/65 hover:bg-slate-950/90 text-white backdrop-blur-md transition-all z-30 shadow-lg hover:scale-105 active:scale-95 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Scrollable Container with Lenis isolation & custom scrollbar */}
                <div
                  data-lenis-prevent="true"
                  className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-5 sm:p-7 space-y-6"
                >
                  {/* Modal Header Media */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 shadow-sm group">
                    <img
                      src={activeModalDest.image}
                      alt={activeModalDest.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-md shadow-xs">
                        {activeModalDest.category}
                      </span>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                        {activeModalDest.state}
                      </span>
                    </div>

                    {/* Bottom Title */}
                    <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 text-white">
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5 drop-shadow-md">
                        <span>{activeModalDest.name}</span>
                        <span className="text-2xl sm:text-3xl">{activeModalDest.emoji}</span>
                      </h2>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                        Destination Overview
                      </h4>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {activeModalDest.shortDesc}
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/40 dark:from-blue-950/40 dark:to-slate-900/40 border border-blue-200/70 dark:border-blue-800/50 shadow-xs">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                        <span>Why Visit</span>
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeModalDest.whyVisit}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Calendar size={13} className="text-blue-500" />
                          <span>Best Travel Season</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {activeModalDest.bestSeason}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-emerald-500" />
                          <span>Partner Coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Verified Local Network
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Famous Attractions */}
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <Compass size={13} className="text-blue-500" />
                        <span>Famous Attractions</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeModalDest.attractions.map((attr) => (
                          <span
                            key={attr}
                            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Travel Pointers */}
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5">
                        Regional Travel Pointers
                      </h4>
                      <div className="space-y-2.5">
                        {activeModalDest.travelPointers.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Docked Sticky Modal Footer */}
                <div className="p-4 sm:px-7 sm:py-4 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                    Explore detailed itineraries, verified operators, and driver contacts in the web app.
                  </p>
                  <a
                    href="https://app.apnatrip.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm rounded-xl shrink-0 inline-flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <span>View Site</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
