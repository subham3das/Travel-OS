import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Tag, MessageSquare, Headphones, HelpCircle } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

const defaultFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does ApnaTrip verify travel agencies?',
    answer:
      'Every agency undergoes a strict 5-step verification process including official business registration audit, background checks, traveler safety record reviews, and authentic customer feedback validation before earning the Verified badge.',
    icon: <ShieldCheck className="w-5 h-5" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'faq-2',
    question: 'How does the Best Price Guarantee work?',
    answer:
      'We partner directly with local tour operators and verified agencies without middlemen. This ensures 100% transparent pricing with zero hidden fees or inflated commission markups.',
    icon: <Tag className="w-5 h-5" />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
  {
    id: 'faq-3',
    question: 'Are reviews and traveler stories authentic?',
    answer:
      'Yes, 100% authentic. Reviews, ratings, and travel stories can only be posted by verified travelers who have completed genuine bookings or trips through ApnaTrip.',
    icon: <MessageSquare className="w-5 h-5" />,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: 'faq-4',
    question: 'What support do I get during my trip?',
    answer:
      'Our dedicated 24/7 concierge support team and on-ground local agency partners are available round-the-clock via live chat, call, and instant messaging for any emergencies or assistance.',
    icon: <Headphones className="w-5 h-5" />,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'faq-5',
    question: 'Can I customize my trip packages with local guides?',
    answer:
      'Absolutely! You can chat directly with verified agencies to customize itinerary routes, dates, hotel choices, and special activities tailored to your group size and budget.',
    icon: <HelpCircle className="w-5 h-5" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

interface FaqAccordionProps {
  title?: string;
  items?: FaqItem[];
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  title = 'Why Explore on ApnaTrip? (FAQ)',
  items = defaultFaqs,
  className = '',
}) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`rounded-3xl bg-white p-5 sm:p-8 border border-slate-100 shadow-2xs ${className}`}>
      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-6 text-center">
        {title}
      </h3>

      {/* Accordion Dropdown List */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'border-[#FF4D6D]/30 bg-gradient-to-r from-rose-50/40 via-white to-pink-50/20 shadow-2xs'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {/* Question Dropdown Button */}
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none group cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  {item.icon && (
                    <div
                      className={`w-10 h-10 rounded-xl ${
                        item.iconBg || 'bg-rose-50'
                      } ${item.iconColor || 'text-[#FF4D6D]'} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                    >
                      {item.icon}
                    </div>
                  )}
                  <h4 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">
                    {item.question}
                  </h4>
                </div>

                {/* Chevron Indicator */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs group-hover:text-[#FF4D6D]"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              {/* Animated Answer Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100/60 ml-0 sm:ml-13">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
