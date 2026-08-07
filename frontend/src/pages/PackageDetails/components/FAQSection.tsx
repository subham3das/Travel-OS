import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { PackageFAQ } from '../../../types/package';

interface FAQSectionProps {
  faq: PackageFAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faq }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const defaultFaq: PackageFAQ[] = faq && faq.length > 0 ? faq : [
    {
      question: 'What is the best time to visit Meghalaya?',
      answer: 'September to May is the best time to visit Meghalaya with clear skies, comfortable temperatures and cascading waterfalls in Cherrapunji.',
    },
    {
      question: 'What should I pack for this trip?',
      answer: 'We recommend bringing comfortable trekking shoes, waterproof rain jackets/umbrellas, light woollens for Shillong evenings, power banks, and camera gear.',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          FAQ
        </h2>
        <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>View All FAQ</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {defaultFaq.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
              >
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                  {item.question}
                </h3>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-50 pt-2 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
