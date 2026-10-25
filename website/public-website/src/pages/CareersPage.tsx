import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Sparkles,
  Heart,
  Globe2,
  Compass,
  Zap,
  Coffee,
  Laptop,
  GraduationCap,
  Users2,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CULTURE_VALUES = [
  {
    icon: Compass,
    title: 'Travel-First Empathy',
    desc: 'We are active explorers ourselves. We build software by riding the passes, visiting the local homestays, and understanding true ground friction.',
  },
  {
    icon: Zap,
    title: 'High Agency & Velocity',
    desc: 'Small teams, high trust. You own decisions end-to-end with minimum red tape and direct feedback loops.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity Above All',
    desc: 'Our platform handles real travelers and regional small businesses. We protect safety, escrow payments, and trust without compromise.',
  },
  {
    icon: Users2,
    title: 'Empowering Local Operators',
    desc: 'We champion authentic local agencies over monopolistic middleman aggregators. When our regional partners win, we win.',
  },
];

const PERKS = [
  {
    icon: Globe2,
    title: 'Travel Stipend & Expeditions',
    desc: 'Annual allowances to explore Indian destinations and test our partner circuits firsthand.',
  },
  {
    icon: Laptop,
    title: 'Modern Work Hardware',
    desc: 'Top-tier M-series MacBooks and home workstation budget for your optimal work environment.',
  },
  {
    icon: Heart,
    title: 'Comprehensive Health Cover',
    desc: 'Complete medical, parental, and mental wellness insurance for you and your dependents.',
  },
  {
    icon: Coffee,
    title: 'Flexible & Remote Friendly',
    desc: 'Autonomous work hours with hybrid and remote accommodations based on your life.',
  },
  {
    icon: GraduationCap,
    title: 'Learning & Books Budget',
    desc: 'Generous annual allowance for tech books, courses, industry conferences, and workshops.',
  },
  {
    icon: Sparkles,
    title: 'Meaningful Equity (ESOPs)',
    desc: 'Every core team member participates directly in the long-term wealth creation of ApnaTrip.',
  },
];

const HIRING_STEPS = [
  {
    step: '01',
    title: 'Initial Conversation',
    desc: 'A relaxed 30-minute chat to discuss your journey, what excites you, and mutual goals.',
  },
  {
    step: '02',
    title: 'Practical Craft Evaluation',
    desc: 'A real-world discussion or small take-home problem reflecting the exact challenges we solve daily.',
  },
  {
    step: '03',
    title: 'Culture & Mission Deep-Dive',
    desc: 'Meet our founders and cross-functional team members to align on vision and working styles.',
  },
  {
    step: '04',
    title: 'Offer & Onboarding',
    desc: 'Transparent compensation offer, fast turnaround, and a warm welcome to the ApnaTrip family.',
  },
];

export default function CareersPage() {
  return (
    <>
      <Helmet>
        <title>Careers at ApnaTrip — Join The Team Building The Future of Travel</title>
        <meta
          name="description"
          content="Explore career opportunities at ApnaTrip. Join our team building India's premier travel technology platform and empowerment ecosystem for local operators."
        />
        <meta property="og:title" content="Careers at ApnaTrip — Build The Future of Travel" />
        <meta
          property="og:description"
          content="Join our mission to empower authentic regional travel agencies and connect explorers with verified journeys."
        />
        <link rel="canonical" href="https://apnatrip.in/careers" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-24 selection:bg-blue-500 selection:text-white">
        {/* ── 1. Hero Header ─────────────────────────────────────────────── */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4"
            >
              <Briefcase size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Careers at ApnaTrip</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Join the Team Building
              <br />
              <span className="text-blue-600 dark:text-blue-400">The Future of Travel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              We are reimagining travel across India by giving licensed regional operators a digital operating system and giving explorers reliable, escrow-protected journeys.
            </motion.p>
          </div>
        </section>

        {/* ── 2. Mission & Culture ────────────────────────────────────────── */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Our Culture & Principles
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                How we think, solve hard problems, and collaborate as a distributed team across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CULTURE_VALUES.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Benefits & Perks ─────────────────────────────────────────── */}
        <section className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} />
                <span>Life at ApnaTrip</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Why Work With Us
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                We take care of the essentials so you can do the most meaningful work of your career.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PERKS.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {perk.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. Hiring Process ───────────────────────────────────────────── */}
        <section className="py-20 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Our Hiring Process
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Respectful of your time, straightforward, and focused on real craftsmanship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HIRING_STEPS.map((h, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {h.step}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {h.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Current Openings Section ─────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-4xl mt-12">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/80 dark:from-blue-950/70 dark:via-slate-900 dark:to-indigo-950 border-2 border-blue-200/80 dark:border-blue-500/30 shadow-xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
              <Briefcase size={14} />
              <span>Status: Talent Pool Open</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Current Openings
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              We are not actively hiring at the moment, but we&apos;re always excited to connect with talented people. Send your resume to <a href="mailto:subhamdas26e@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4">subhamdas26e@gmail.com</a> and we&apos;ll keep it on file for future opportunities.
            </p>

            <div className="pt-4 flex justify-center">
              <a
                href="mailto:subhamdas26e@gmail.com?subject=Career%20Inquiry%20-%20ApnaTrip"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <Mail size={16} />
                <span>Email Your Resume</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
