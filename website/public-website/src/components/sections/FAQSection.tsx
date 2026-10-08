import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does ApnaTrip verify travel agencies and vehicle partners?',
    a: 'Every partner on ApnaTrip undergoes physical and regulatory compliance verification. We audit GST registration, Ministry of Tourism permits, driver commercial licenses, vehicle fitness certificates, and bank account ownership before enabling listings.',
  },
  {
    q: 'How does the milestone payment escrow protect travelers?',
    a: 'When you book a tour or vehicle on ApnaTrip, your payment is held securely in escrow. Funds are not disbursed upfront to the operator in full; rather, they are released incrementally as tour milestones and hotel check-ins are verified by you on your itinerary.',
  },
  {
    q: 'Can I book one-way intercity cab routes without surge pricing?',
    a: 'Yes. Our Route Booking module offers verified flat-rate intercity routes (such as Guwahati to Shillong or Dehradun to Mussoorie). Fares are pre-calculated based on standardized route metrics with zero last-minute surge pricing.',
  },
  {
    q: 'Are self-drive rentals deposit-free?',
    a: 'Verified ApnaTrip travelers who complete their one-time digital KYC profile can access zero or minimal deposit rentals with our certified fleet partners. Every vehicle undergoes a 12-point digital handover check via the app before departure.',
  },
  {
    q: 'How do travel agencies receive payouts?',
    a: 'Agencies configure their verified bank accounts in the Agency Portal. Once a trip milestone is completed and verified, payouts are settled automatically within 24 hours directly to their linked accounts.',
  },
  {
    q: 'What is the ApnaTrip Community?',
    a: 'The ApnaTrip Community currently operates through official WhatsApp Communities. Join to connect with fellow travelers, receive verified travel updates, discover destinations, ask route questions, get agency announcements, and stay informed about upcoming group trips — no in-app social feed required.',
  },
  {
    q: 'How can a travel agency join ApnaTrip?',
    a: 'Travel agencies can apply through the Partner With Us page. Agencies undergo physical and regulatory verification including GST, PAN, and Ministry of Tourism permits before being approved on the platform. Once verified, they get access to the Agency Portal to manage packages, bookings, and settlements.',
  },
  {
    q: 'How can a vehicle owner list their fleet on ApnaTrip?',
    a: 'Vehicle owners and fleet operators can register through the Partner With Us page. Vehicles are verified through fitness certificates and driver license checks. Once approved, listings become available for route bookings and self-drive rentals on the platform.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <HelpCircle size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Transparent answers regarding our verification, payments, routes, and partner programs.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-600 text-white dark:bg-blue-600' : ''
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
