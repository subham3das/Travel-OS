import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface FAQSectionProps {
  destination: Destination;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ destination }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2.5">
        {destination.faq.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#6356E5] shrink-0" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                    {item.question}
                  </h3>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="pt-2 text-xs font-semibold text-slate-600 border-t border-slate-100 leading-relaxed">
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
