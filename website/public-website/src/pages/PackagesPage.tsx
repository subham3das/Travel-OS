import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Mountain,
  Users,
  Heart,
  Briefcase,
  Sun,
  Camera,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface ExperienceType {
  id: string;
  name: string;
  icon: typeof Mountain;
  tagline: string;
  image: string;
  description: string;
  highlights: string[];
  popularCircuits: string[];
  idealFor: string;
}

const experiences: ExperienceType[] = [
  {
    id: 'adventure',
    name: 'Adventure Expeditions',
    icon: Mountain,
    tagline: 'High-Altitude Treks, Passes & Raging Rivers',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80&auto=format',
    description:
      'Challenging alpine passes, river rapids, rugged dirt corridors, and remote trails for explorers who crave the outdoors. Supported by certified wilderness guides, rigorous gear audits, and contingency planning.',
    highlights: [
      'Certified mountain guides and high-grade safety equipment',
      'Daily medical check-ins and altitude acclimatization days',
      'Strict Leave-No-Trace environmental protocol compliance',
      'All-terrain vehicle support on trans-Himalayan roads',
    ],
    popularCircuits: ['Ladakh High Passes', 'Spiti Valley Circuit', 'Zanskar River Expedition', 'Meghalaya Caving'],
    idealFor: 'Thrill-seekers, trekking enthusiasts, and outdoor adventurers.',
  },
  {
    id: 'family',
    name: 'Family Vacations',
    icon: Users,
    tagline: 'Comfortable, Paced Journeys for All Generations',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80&auto=format',
    description:
      'Carefully planned vacations balancing curiosity and relaxation. Child-friendly pacing, verified hotels with spacious rooms, verified drivers, and direct door-to-door transit so you can focus on quality time together.',
    highlights: [
      'Spacious AC vehicles with vetted, polite family drivers',
      'Verified accommodations with vetted hygiene and meal flexibility',
      'Relaxed daily schedules with zero rushed itineraries',
      '24×7 real-time on-trip support desk for family emergencies',
    ],
    popularCircuits: ['Kerala Backwaters & Munnar', 'Golden Triangle Heritage', 'Himachal Hill Towns', 'Andaman Islands'],
    idealFor: 'Parents, multi-generational families, and relaxed vacationers.',
  },
  {
    id: 'honeymoon',
    name: 'Honeymoon & Romantic Getaways',
    icon: Heart,
    tagline: 'Intimate Escapes in Scenic Paradises',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80&auto=format',
    description:
      'Private villa stays, candlelit lakeside settings, misty tea hills, and quiet coastal sunsets designed for newly married couples and anniversary milestones.',
    highlights: [
      'Handpicked boutique properties with panoramic scenic vistas',
      'Private dedicated transfers with complete discretion and safety',
      'Complimentary welcome touches and curated romantic experiences',
      'Unhurried, flexible daily schedules crafted for privacy',
    ],
    popularCircuits: ['Kashmir Valley & Gulmarg', 'Udaipur Palace Lakes', 'Munnar & Alleppey Private Houseboats', 'Havelock Islands'],
    idealFor: 'Couples seeking seclusion, romance, and scenic relaxation.',
  },
  {
    id: 'group',
    name: 'Group Tours & Expeditions',
    icon: Users,
    tagline: 'Shared Memories, Community Camaraderie & Road Trips',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80&auto=format',
    description:
      'Energetic road journeys and shared expeditions for friends, college cohorts, and solo travelers wanting to explore together. Share costs, exchange stories around bonfires, and make lifelong friendships.',
    highlights: [
      'Shared group transfers optimizing per-person transit costs',
      'Coordinated departures with verified local trip leads',
      'Group activities including camping, village walks, and music',
      'Transparent splitting and milestone escrow security',
    ],
    popularCircuits: ['North East Living Root Trail', 'Manali to Leh Caravan', 'Goa Coastal Loop', 'Western Ghats Monsoon Camp'],
    idealFor: 'Friend circles, solo explorers joining groups, and road-trippers.',
  },
  {
    id: 'corporate',
    name: 'Corporate Trips & Offsites',
    icon: Briefcase,
    tagline: 'Team Retreats, Conclaves & Strategic Outbounds',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format',
    description:
      'Re-energize your team with inspiring offsites set against serene natural backdrops. Comprehensive arrangements covering high-speed internet stays, breakout spaces, experiential team activities, and seamless group logistics.',
    highlights: [
      'Properties equipped with conferencing halls and high-speed Wi-Fi',
      'Curated outdoor team-building workshops and guided hikes',
      'Consolidated GST invoicing and verified corporate vendor paperwork',
      'Dedicated on-ground operations manager throughout the offsite',
    ],
    popularCircuits: ['Rishikesh Riverside Retreats', 'Coorg Plantation Offsites', 'Jim Corbett Wilderness Camps', 'Udaipur Heritage Conclaves'],
    idealFor: 'Startups, engineering teams, leadership retreats, and corporate departments.',
  },
  {
    id: 'spiritual',
    name: 'Spiritual & Cultural Journeys',
    icon: Sun,
    tagline: 'Ancient Temples, Sacred Ghats & Heritage Wisdom',
    image: 'https://images.unsplash.com/photo-1561361058-c24e01b35ded?w=800&q=80&auto=format',
    description:
      'Deeply moving pilgrimages and cultural explorations connecting you with India’s sacred traditions, Vedic roots, sacred river rituals, and ancient architectural masterpieces.',
    highlights: [
      'Assistance with darshan protocols and temple timings',
      'Knowledgeable local heritage guides explaining Vedic history',
      'Peaceful, clean homestays and ashram accommodations',
      'Pure vegetarian culinary options ensured throughout the circuit',
    ],
    popularCircuits: ['Varanasi & Sarnath Ghats', 'Char Dham Himalayan Corridors', 'Tamil Nadu Great Chola Temples', 'Amritsar Golden Temple'],
    idealFor: 'Spiritual seekers, heritage enthusiasts, and elders seeking smooth pilgrimages.',
  },
  {
    id: 'wildlife',
    name: 'Wildlife & Nature Safaris',
    icon: Camera,
    tagline: 'Untamed Forests, National Parks & Rare Species',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&q=80&auto=format',
    description:
      'Venture into protected forest sanctuaries, birding paradises, and renowned tiger reserves. Experience thrilling open-gypsy safaris guided by certified naturalists and local forest trackers.',
    highlights: [
      'Certified open 4x4 safaris with licensed forest department drivers',
      'Experienced naturalists skilled in bird and mammal tracking',
      'Eco-sensitive lodges situated close to sanctuary buffer zones',
      'Dawn and twilight safari slot guidance and permit coordination',
    ],
    popularCircuits: ['Kaziranga Rhino Sanctuary (Assam)', 'Jim Corbett National Park', 'Ranthambore Tiger Reserve', 'Periyar Wildlife Sanctuary'],
    idealFor: 'Wildlife photographers, nature conservationists, and wildlife lovers.',
  },
  {
    id: 'weekend',
    name: 'Weekend Getaways',
    icon: Clock,
    tagline: 'Quick 2 to 3-Day Escapes from City Life',
    image: 'https://images.unsplash.com/photo-1605457867610-e990b192553e?w=800&q=80&auto=format',
    description:
      'Need a short break without taking leave? Discover quick, high-reward road trips and scenic escapes located within a short drive or train journey from India’s major metropolitan centers.',
    highlights: [
      'Pre-curated 48-hour itineraries maximizing relaxation',
      'Instant self-drive car or verified driver vehicle coordination',
      'Doorstep handover and express check-in partner stays',
      'Zero planning fatigue — curated road trip maps and café pitstops',
    ],
    popularCircuits: ['Delhi → Kasauli / Rishikesh', 'Bengaluru → Coorg / Wayanad', 'Mumbai → Lonavala / Alibaug', 'Guwahati → Shillong'],
    idealFor: 'Working professionals, city dwellers, and spontaneous road-trippers.',
  },
];

export default function PackagesPage() {
  const [selectedExp, setSelectedExp] = useState<ExperienceType | null>(null);

  useEffect(() => {
    if (selectedExp) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedExp(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedExp]);

  return (
    <>
      <Helmet>
        <title>Our Tour Experiences — ApnaTrip</title>
        <meta
          name="description"
          content="Explore diverse travel styles and tour experiences across India. From high-altitude adventures and peaceful family holidays to romantic getaways and corporate retreats."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-24">
        {/* Header Section */}
        <div className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4"
            >
              <Compass size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Tour Experiences</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Our Tour Experiences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Explore India by travel style. ApnaTrip connects you with licensed regional agencies who curate tailor-made journeys with end-to-end local support.
            </motion.p>
          </div>
        </div>

        {/* Experience Cards Grid */}
        <div className="container mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {experiences.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Media */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-slate-800">
                      <img
                        src={exp.image}
                        alt={exp.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 p-2 rounded-xl bg-black/50 backdrop-blur-md text-white">
                        <Icon size={18} />
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[11px] font-semibold text-blue-300 block uppercase tracking-wider">
                          {exp.tagline}
                        </span>
                        <h3 className="text-xl font-bold leading-tight mt-0.5">{exp.name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {exp.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Popular Circuits:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {exp.popularCircuits.slice(0, 2).map((circ) => (
                            <span
                              key={circ}
                              className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {circ}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informational Action */}
                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={() => setSelectedExp(exp)}
                      className="w-full py-2.5 rounded-xl border border-blue-600/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group-hover:bg-blue-600 group-hover:text-white"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Informational Detail Modal */}
        <AnimatePresence>
          {selectedExp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedExp(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
              >
                {/* Floating Frosted Close Button - Always visible */}
                <button
                  onClick={() => setSelectedExp(null)}
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
                      src={selectedExp.image}
                      alt={selectedExp.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 text-white">
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-md mb-2 inline-block shadow-xs">
                        {selectedExp.tagline}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 drop-shadow-md">
                        <span>{selectedExp.name}</span>
                      </h2>
                    </div>
                  </div>

                  {/* Experience Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                        Experience Philosophy
                      </h4>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {selectedExp.description}
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/40 dark:from-blue-950/40 dark:to-slate-900/40 border border-blue-200/70 dark:border-blue-800/50 shadow-xs">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                        <span>Ideal For</span>
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedExp.idealFor}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-blue-500" />
                        <span>Key Highlights & Standards</span>
                      </h4>
                      <div className="space-y-2.5">
                        {selectedExp.highlights.map((h, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60"
                          >
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Circuits */}
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <Compass size={13} className="text-blue-500" />
                        <span>Popular Circuits Across India</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExp.popularCircuits.map((circ) => (
                          <span
                            key={circ}
                            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
                          >
                            {circ}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Docked Sticky Modal Footer */}
                <div className="p-4 sm:px-7 sm:py-4 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                    To explore itineraries from verified agencies matching this style, open the ApnaTrip web application.
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
