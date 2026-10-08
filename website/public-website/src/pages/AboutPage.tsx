import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Search,
  Car,
  AlertTriangle,
  Globe2,
  Lock,
  Layers,
  Users2,
  Award,
  Sparkles,
  CheckCircle,
  Mail,
  Building,
  Star,
  Zap,
  Heart,
  Cpu,
  Eye,
} from 'lucide-react';
import styles from './AboutPage.module.css';

// ── Data: Section 3 Problems ──────────────────────────────────────────────────
const problems = [
  {
    icon: Search,
    title: 'Finding Agencies',
    desc: 'Hours wasted on Google results, generic yellow pages, and unverified operators with no price clarity.',
    badge: 'Scattered Listings',
  },
  {
    icon: Car,
    title: 'Finding Car Rentals',
    desc: 'Calling personal phone numbers, arbitrary security deposit withholdings, and poorly maintained vehicles.',
    badge: 'Zero Standardization',
  },
  {
    icon: AlertTriangle,
    title: 'Trust & Safety Issues',
    desc: 'Sending 50% advance deposits directly to personal UPI accounts with zero escrow or refund guarantees.',
    badge: 'High Risk',
  },
  {
    icon: Globe2,
    title: 'Too Many Disconnected Apps',
    desc: 'One app for cabs, another for forums, another for hotels, and endless WhatsApp chats for local itineraries.',
    badge: 'Fragmented Info',
  },
  {
    icon: ShieldCheck,
    title: 'No Document Audits',
    desc: 'No verification of driver commercial licenses, GST/PAN compliance, or tourism ministry registrations.',
    badge: 'Unregulated',
  },
  {
    icon: Layers,
    title: 'No Unified Travel Identity',
    desc: 'Submitting Aadhaar, emergency contacts, and medical history repeatedly to every single hotel or tour guide.',
    badge: 'Repetitive KYC',
  },
];

// ── Data: Section 4 Ecosystem Chain ──────────────────────────────────────────
const ecosystemNodes = [
  'Traveler',
  'Verified Agencies',
  'Route Booking',
  'Vehicle Rentals',
  'Secure Payments',
  'Travel Profile',
  'WhatsApp Community',
  'Verified Reviews',
];

// ── Data: Section 5 How It Works Steps ───────────────────────────────────────
const workflowSteps = [
  { num: '01', title: 'Discover', desc: 'Browse verified destinations, authentic reviews & curated itineraries.' },
  { num: '02', title: 'Choose Destination', desc: 'Filter transparent fixed routes, local stays, and verified operators.' },
  { num: '03', title: 'Book Agency / Vehicle', desc: 'Instant confirmation with transparent package pricing.' },
  { num: '04', title: 'Secure Escrow Payment', desc: 'Funds safely held until trip milestones and check-in are verified.' },
  { num: '05', title: 'Unified KYC Profile', desc: 'One-time encrypted profile shared safely with assigned partners.' },
  { num: '06', title: 'Live Journey & SOS', desc: 'GPS vehicle tracking, 24×7 support desk, and emergency assistance.' },
  { num: '07', title: 'WhatsApp Community & Review', desc: 'Join the official ApnaTrip WhatsApp Community and share genuine travel tips with fellow explorers.' },
];

// ── Data: Section 8 What Makes Us Different ──────────────────────────────────
const differentiators = [
  { icon: Building, title: 'Verified Agencies', desc: 'Rigorous GST, PAN, and tourism license audit before onboarding.' },
  { icon: Users2, title: 'Verified Travelers', desc: 'One-time unified digital KYC ensuring safety for everyone in the group.' },
  { icon: Lock, title: 'Escrow Protected Payments', desc: 'Payments secured via Razorpay; released to agencies only on check-in.' },
  { icon: Award, title: 'WhatsApp Community', desc: 'Connect with fellow travelers through the official ApnaTrip WhatsApp Communities for updates and tips.' },
  { icon: Car, title: 'Self Drive & Fleet Rentals', desc: 'Transparent vehicle checklists, airport pickups, and zero deposit traps.' },
  { icon: Compass, title: 'Explorer Community', desc: 'Connect with fellow solo travelers, join weekend treks, and share notes.' },
  { icon: Cpu, title: 'Modern Technology', desc: 'Fast, real-time operating system for agencies and travelers alike.' },
  { icon: Eye, title: '100% Transparent', desc: 'No hidden taxes, no surge surges, and zero commission price inflation.' },
];

// ── Data: Section 10 Founder Milestones ──────────────────────────────────────
const founderTimeline = [
  { year: '2023', stage: 'Started Traveling', detail: 'Solo expeditions across Meghalaya, Assam, and Himachal Pradesh revealed deep fragmentation.' },
  { year: '2024', stage: 'Experienced Real Friction', detail: 'Losing deposits to ghost operators and facing vehicle breakdowns on remote mountain passes.' },
  { year: '2025', stage: 'Started Building ApnaTrip', detail: 'Prototyped unified agency operating system and milestone escrow payment architecture.' },
  { year: '2026', stage: 'Platform Launch & Growth', detail: 'Connecting hundreds of verified operators and thousands of explorers across India.' },
];

// ── Data: Section 11 Core Values ─────────────────────────────────────────────
const coreValues = [
  { icon: ShieldCheck, title: 'Trust First', desc: 'Every agency, vehicle, and payment milestone is verified before execution.' },
  { icon: Cpu, title: 'Engineering Rigor', desc: 'Building lightning-fast, resilient tools built specifically for Indian travel logistics.' },
  { icon: Users2, title: 'Community Centric', desc: 'Empowering genuine local operators and explorers over predatory aggregators.' },
  { icon: Eye, title: 'Total Transparency', desc: 'Clear flat rates, direct payouts, and zero surprise platform markups.' },
  { icon: Heart, title: 'Uncompromising Quality', desc: 'Dedicated 24×7 passenger safety escalation desk and traveler-first care.' },
];

// ── Data: Section 12 Roadmap ─────────────────────────────────────────────────
const roadmapCompleted = [
  'Verified Agency Ecosystem',
  'Custom Multi-Day Packages',
  'Intercity Route Booking',
  'Self-Drive Car & Bike Rentals',
  'Milestone Escrow Payments',
  'Unified KYC Profile Engine',
  'WhatsApp Community & Travel Network',
];

const roadmapUpcoming = [
  'Boutique Homestays & Heritage Hotels',
  'Regional Small-Aircraft & Helipad Connect',
  'Curated Solo Traveler Group Departures',
  'Cross-Border Bhutan & Nepal Packages',
  'Voice-Enabled AI Itinerary Companion',
];

// ── Data: Section 13 Testimonials ────────────────────────────────────────────
const reviews = [
  {
    name: 'Rahul Sharma',
    city: 'New Delhi',
    rating: 5,
    text: 'Travelling with family to Cherrapunji used to mean endless phone calls. ApnaTrip verified operator was flawless. Escrow payment gave complete peace of mind.',
    trip: '7-Day Meghalaya Expedition',
  },
  {
    name: 'Priya Nair',
    city: 'Bengaluru',
    rating: 5,
    text: 'As a solo woman traveler, the verified driver and live vehicle tracking feature were deal-makers for me. Truly built by someone who understands real travel.',
    trip: 'Spiti Valley Road Journey',
  },
  {
    name: 'Amit Roy',
    city: 'Kolkata',
    rating: 5,
    text: 'Rented a 4x4 Thar in Guwahati for Arunachal. No arbitrary deposit deductions, clean paperwork, and instant pickup. Very professional.',
    trip: 'Tawang Circuit Self-Drive',
  },
  {
    name: 'Neha Das',
    city: 'Guwahati',
    rating: 5,
    text: 'The community let me find two like-minded girls for a trek in Dzükou Valley. We booked our transport through route booking with zero surge.',
    trip: 'Dzükou Valley Explorer',
  },
  {
    name: 'Rohit Jain',
    city: 'Jaipur',
    rating: 5,
    text: 'The agency portal makes direct booking transparent. No hidden commissions, clear day-by-day itinerary, and instant emergency support.',
    trip: 'Ladakh High Passes Tour',
  },
  {
    name: 'Ananya Sen',
    city: 'Mumbai',
    rating: 5,
    text: 'The WhatsApp community helped me find two other solo travelers for a trek in Dzükou Valley. We coordinated the entire trip through the group — it was seamless.',
    trip: 'Kaziranga & Majuli Tour',
  },
];

// ── Data: Section 14 Agencies ────────────────────────────────────────────────
const agencies = [
  { name: 'NorthEast Trails', city: 'Guwahati, Assam', badge: 'Verified Operator', trips: '320+ Trips' },
  { name: 'Royal Assam Tours', city: 'Dibrugarh, Assam', badge: 'Verified Operator', trips: '190+ Trips' },
  { name: 'Explore Meghalaya', city: 'Shillong, Meghalaya', badge: 'Verified Operator', trips: '240+ Trips' },
  { name: 'Highland Travels', city: 'Shillong, Meghalaya', badge: 'Verified Operator', trips: '180+ Trips' },
  { name: 'Adventure NorthEast', city: 'Itanagar, Arunachal', badge: 'Verified Operator', trips: '115+ Trips' },
  { name: 'Kaziranga Safari Hub', city: 'Golaghat, Assam', badge: 'Verified Operator', trips: '290+ Trips' },
];

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://apnatrip.in/#organization',
        name: 'ApnaTrip',
        url: 'https://apnatrip.in',
        logo: 'https://apnatrip.in/logo.png',
        description: "India's connected travel ecosystem connecting travelers, verified tour operators, and mobility services.",
        founder: {
          '@type': 'Person',
          name: 'Subham Das',
          jobTitle: 'Founder & Developer',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dibrugarh',
            addressRegion: 'Assam',
            addressCountry: 'India',
          },
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dibrugarh',
          addressRegion: 'Assam',
          addressCountry: 'India',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://apnatrip.in' },
          { '@type': 'ListItem', position: 2, name: 'About ApnaTrip', item: 'https://apnatrip.in/about' },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>About ApnaTrip — Our Story, Vision & The Travel Ecosystem</title>
        <meta
          name="description"
          content="Learn why ApnaTrip was built: born from real travel frustration to unite verified agencies, transparent vehicle rentals, milestone escrow payments, and community across India."
        />
        <meta property="og:title" content="About ApnaTrip — Connected Travel Ecosystem for India" />
        <meta
          property="og:description"
          content="Discover how ApnaTrip solves travel fragmentation: connecting travelers, licensed tour operators, route cabs, and vehicle rentals on one trusted platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apnatrip.in/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://apnatrip.in/about" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className={styles.page}>
        {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} className="text-blue-600" />
                <span>Our Story</span>
              </div>

              <h1 className={styles.heroTitle}>
                Travel wasn't difficult.{' '}
                <span className={styles.heroItalic}>Finding trusted people to travel with was.</span>
              </h1>

              <p className={styles.heroSub}>
                ApnaTrip was born from real travel experiences, real frustrations, and a simple
                idea—to make travelling across India easier, safer, and more connected.
              </p>

              <div className={styles.heroCtas}>
                <a href="https://app.apnatrip.in" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <span>Explore Platform</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#founder" className="btn-ghost">
                  <span>Meet the Founder</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 2: FOUNDER'S STORY ───────────────────────────────────── */}
        <section id="founder-story" className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Portrait Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-3">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80"
                      alt="Subham Das - Founder of ApnaTrip"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <div className="text-xs uppercase tracking-wider font-bold text-blue-400">Founder & Developer</div>
                        <div className="text-xl font-bold">Subham Das</div>
                        <div className="text-xs text-slate-300 mt-0.5">Dibrugarh, Assam, India</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Story Narrative */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <span>Behind The Idea</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  “I got tired of calling random phone numbers and hoping for the best.”
                </h2>

                <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    It started on a solo journey across Northeast India. Planning the trip didn't feel like an
                    adventure—it felt like a high-stakes investigation.
                  </p>
                  <p>
                    I spent countless hours searching Google for travel agencies, scrolling through unregulated social media
                    groups, calling phone numbers scribbled on forum posts, and transferring advance deposits to unverified UPI
                    IDs with fingers crossed.
                  </p>
                  <p>
                    Finding a rental car or bike was even more stressful: hidden charges at pickup, arbitrary deposit withholdings,
                    and cars that looked nothing like their photos. Information was scattered everywhere. There was no single place
                    where travelers could verify who they were dealing with, pay through escrow, and track their route with confidence.
                  </p>
                  <blockquote className="border-l-4 border-blue-600 pl-4 py-2 my-4 italic text-slate-900 dark:text-white font-medium bg-blue-50/50 dark:bg-blue-950/30 rounded-r-xl">
                    “Instead of waiting for someone else to solve this problem, I decided to build it.”
                  </blockquote>
                  <p>
                    ApnaTrip was built not in a boardroom, but from the raw frustration of an explorer who wanted travel in India to be
                    honest, safe, and truly connected.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: THE PROBLEM ───────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span>The Friction We Remove</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Travel Planning Shouldn't Feel Like Research.
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Before ApnaTrip, travellers navigated fragmented systems with high risk and zero safety nets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: OUR SOLUTION (CONNECTED ECOSYSTEM) ────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>The Unified Solution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                One Platform. Entire Travel Ecosystem.
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Everything connected under one verified, digital identity.
              </p>
            </div>

            {/* Interactive Connected Nodes Visualization */}
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                {ecosystemNodes.map((node, i) => (
                  <motion.div
                    key={node}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2 hover:border-blue-500/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100">{node}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: HOW APNATRIP WORKS (TIMELINE) ─────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Journey Workflow</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                How ApnaTrip Works
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                From discovery to your journey — transparent and supported at every milestone.
              </p>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 transition-colors"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 shrink-0 w-10">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">{step.desc}</p>
                  </div>
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 & 7: MISSION & VISION ──────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                To simplify travel across India by connecting travelers, verified agencies, and mobility services on one trusted platform.
              </h2>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Our Vision</span>
              </div>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                We believe every traveler deserves one trusted place to discover, connect, and travel. We are building India's
                connected travel ecosystem—not another booking website.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: WHAT MAKES US DIFFERENT ───────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Platform Tenets</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                What Makes ApnaTrip Different
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Built from ground up with real-world travel safety and operational transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {differentiators.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={d.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{d.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{d.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: PLATFORM GROWTH ───────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="p-8 sm:p-12 rounded-3xl bg-blue-600 text-white shadow-xl relative overflow-hidden">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                <span className="text-xs uppercase tracking-widest font-bold text-blue-200">Live Ecosystem Scale</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Growing Every Week Across India</h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  Authentic growth powered by trusted local tour operators, fleet partners, and genuine travelers.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold">200+</div>
                  <div className="text-xs text-blue-100 mt-1">Verified Agencies</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold">45+</div>
                  <div className="text-xs text-blue-100 mt-1">Active Intercity Routes</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold">120+</div>
                  <div className="text-xs text-blue-100 mt-1">Fleet Vehicle Hubs</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold">100%</div>
                  <div className="text-xs text-blue-100 mt-1">Milestone Escrow</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 10: MEET THE FOUNDER ─────────────────────────────────── */}
        <section id="founder" className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Leadership</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Meet the Founder
              </h2>
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-500 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80"
                    alt="Subham Das"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Subham Das</h3>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Founder & Lead Developer</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Based in Dibrugarh, Assam, India</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                ApnaTrip is designed, developed, and continuously improved with a focus on solving real travel problems
                rather than chasing trends. Every workflow—from KYC verification to multi-day package builders—is tested
                against real situations on Indian roads.
              </p>

              {/* Founder Timeline */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-6">The Journey So Far</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {founderTimeline.map((item) => (
                    <div key={item.year} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.year}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.stage}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 11: CORE VALUES ──────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Guiding Principles</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {coreValues.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{val.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 12: PLATFORM ROADMAP ─────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span>Execution Timeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Platform Roadmap
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Completed */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  <CheckCircle size={14} />
                  <span>Live & Completed</span>
                </div>
                <div className="space-y-3 pt-2">
                  {roadmapCompleted.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
                  <Zap size={14} />
                  <span>Next On Horizon</span>
                </div>
                <div className="space-y-3 pt-2">
                  {roadmapUpcoming.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 13: TESTIMONIALS ─────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span>Verified Traveler Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Trusted by Explorers Across India
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{r.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{r.city}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 14: PARTNER TRUST NETWORK ────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-slate-50/50 dark:bg-slate-950/50`}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Building size={13} />
                <span>Partner Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recently Verified Travel Agencies
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {agencies.map((ag) => (
                <div
                  key={ag.name}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold text-xs">
                    {ag.name[0]}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{ag.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{ag.city}</div>
                  <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 rounded px-1.5 py-0.5 inline-block">
                    {ag.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 15: CONTACT DETAILS ──────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered}`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Mail size={13} />
                <span>Direct Contact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Get in Touch
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Founder Direct</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Subham Das</div>
                <a href="mailto:contact@apnatrip.app" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block">
                  contact@apnatrip.app
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Traveler Support</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">24×7 Concierge</div>
                <a href="mailto:support@apnatrip.app" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block">
                  support@apnatrip.app
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">HQ Location</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Dibrugarh, Assam</div>
                <div className="text-xs text-slate-500">India</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 16: FINAL CTA ────────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionBordered} bg-gradient-to-b from-transparent via-blue-50/40 to-blue-50/70 dark:via-blue-950/20 dark:to-blue-950/40`}>
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Every Great Journey Starts Somewhere.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              For us, it started with one traveler trying to solve his own problem. Now we're building a platform for everyone.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
              <a href="https://app.apnatrip.in" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <span>Start Exploring</span>
                <ArrowRight size={16} />
              </a>
              <a href="/partner" className="btn-ghost">
                <span>Become a Travel Partner</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
