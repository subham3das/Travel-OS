import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Car,
  Users,
  Eye,
  AlertTriangle,
  Headphones,
  CheckCircle2,
  Building2,
  Key,
  Database,
  Award,
  Mail,
  MessageCircle,
} from 'lucide-react';

const VERIFICATION_PILLARS = [
  {
    icon: Building2,
    title: 'Agency Business Verification',
    badge: 'Stage 01',
    description:
      'Every travel agency undergoes mandatory business credential auditing before being listed. We verify GSTIN registration, PAN, state tourism department licenses, and registered office physical premises.',
    checklist: [
      'Active GST & PAN tax registry verification',
      'Ministry of Tourism or Regional Tour Operator license audit',
      'Physical business address proof and bank penny-drop verification',
      'Minimum operating history and customer track-record validation',
    ],
  },
  {
    icon: Car,
    title: 'Vehicle & Fleet Verification',
    badge: 'Stage 02',
    description:
      'Vehicles enrolled in self-drive or cab transit must pass strict commercial compliance standards. We do not permit unverified private vehicles on commercial routes.',
    checklist: [
      'Commercial Taxi / All-India Tourist Permit (AITP) verification',
      'Comprehensive commercial vehicle insurance validity check',
      'Up-to-date Pollution Under Control (PUC) & Fitness Certificate',
      'Physical 24-point vehicle condition & GPS tracking check',
    ],
  },
  {
    icon: Key,
    title: 'Driver Identity & Background',
    badge: 'Stage 03',
    description:
      'Chauffeurs and transport drivers represent passenger safety on challenging regional terrains. We mandate valid commercial authorizations and safety credentials.',
    checklist: [
      'Commercial driving license badge verification',
      'Police Clearance Certificate (PCC) and identity check',
      'Route knowledge validation for mountain and high-altitude passes',
      'Emergency passenger care and courteous conduct agreement',
    ],
  },
  {
    icon: Users,
    title: 'Traveler KYC Verification',
    badge: 'Stage 04',
    description:
      'Safety is mutual. Travelers renting self-drive vehicles or joining group expeditions complete one-time digital KYC to prevent identity fraud and vehicle theft.',
    checklist: [
      'Digital Govt ID (Aadhaar / Passport / Voter ID) verification',
      'Valid driving license verification for self-drive bookings',
      'Automated facial match and liveness verification',
      'Mandatory emergency contact coordination prior to departure',
    ],
  },
];

const SAFETY_FEATURES = [
  {
    icon: Lock,
    title: 'Milestone Escrow Protection',
    desc: 'Never send 50% advance deposits to personal UPI accounts. Traveler payments remain protected in Razorpay escrow and are released to operators only upon successful service milestone execution.',
  },
  {
    icon: Database,
    title: 'DPDP Act Compliance & Data Privacy',
    desc: 'In full accordance with India’s Digital Personal Data Protection Act (DPDP 2023). Identity documents are encrypted at rest with AES-256 and never shared with unauthorized third parties.',
  },
  {
    icon: AlertTriangle,
    title: 'Automated Fraud Prevention',
    desc: 'Real-time risk scoring algorithms monitor for duplicate listings, artificial review manipulation, price gouging, and unauthorized payment redirection.',
  },
  {
    icon: Award,
    title: 'Verified Partner Badge System',
    desc: 'Only partners who maintain 100% compliance, zero unresolved disputes, and high traveler feedback retain the official Verified Partner seal on their digital storefront.',
  },
  {
    icon: Eye,
    title: 'Transparent Vehicle Handover',
    desc: 'Self-drive handovers include mandatory pre-trip photo logs of fuel level, odometer reading, and existing body scuffs to prevent arbitrary security deposit deductions.',
  },
  {
    icon: Headphones,
    title: '24×7 Safety Escalation Desk',
    desc: 'A dedicated, round-the-clock rapid response team standing by to assist with road transit disruptions, itinerary emergencies, and partner escalation in real time.',
  },
];

export default function SafetyPage() {
  return (
    <>
      <Helmet>
        <title>Verification & Safety Architecture — ApnaTrip</title>
        <meta
          name="description"
          content="Learn how ApnaTrip protects travelers and partners through rigorous agency KYC, commercial vehicle inspections, milestone escrow payments, and 24x7 safety escalation."
        />
        <meta property="og:title" content="Verification & Safety — ApnaTrip" />
        <meta
          property="og:description"
          content="Multi-layer trust architecture: GST/PAN auditing, vehicle permits, driver verification, and milestone escrow security."
        />
        <link rel="canonical" href="https://apnatrip.in/safety" />
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
              <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Trust & Governance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Verification & Safety
              <br />
              <span className="text-blue-600 dark:text-blue-400">Multi-Layer Trust Architecture</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              India&apos;s travel industry has suffered from unverified middlemen, phantom advance payments, and unregulated vehicle rentals. Here is how ApnaTrip eliminates risk for every passenger and verified business.
            </motion.p>
          </div>
        </section>

        {/* ── 2. Verification Pillars (Agency, Fleet, Driver, Traveler) ──── */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                How We Verify Our Network
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Four rigorous operational gates required before any operator or vehicle can accept bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VERIFICATION_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Icon size={24} />
                        </div>
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {pillar.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {pillar.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pillar.description}
                      </p>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        {pillar.checklist.map((item, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Safety Measures & Fraud Prevention ──────────────────────── */}
        <section className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <FileCheck size={13} />
                <span>End-to-End Protection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Comprehensive Safety Measures
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Engineering trust into payments, data sovereignty, and real-time transit escalation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAFETY_FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. Reporting Suspicious Activity & Support ─────────────────── */}
        <section className="container mx-auto px-4 max-w-4xl mt-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500/30 dark:border-blue-500/30 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Report Suspicious Activity or Safety Concern
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                If an operator asks for direct off-platform payments, provides unverified vehicles, or violates our code of conduct, report it immediately. All whistleblower submissions are treated with 100% confidentiality.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:subhamdas26e@gmail.com?subject=Safety%20Concern%20Report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all"
              >
                <Mail size={16} />
                <span>Email Safety Desk (subhamdas26e@gmail.com)</span>
              </a>

              <a
                href="https://wa.me/919954060000?text=Hello%20ApnaTrip%20Safety%20Desk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all"
              >
                <MessageCircle size={16} />
                <span>WhatsApp (+91 9954060000)</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
