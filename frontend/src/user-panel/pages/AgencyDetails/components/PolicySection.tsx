import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';

export interface AgencyPolicyItem {
  title: string;
  subtitle?: string;
  content: string;
  icon?: React.ReactNode;
}

interface PolicySectionProps {
  policies?: AgencyPolicyItem[];
}

export const PolicySection: React.FC<PolicySectionProps> = ({ policies = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!policies || policies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3.5">
      <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
        Policies
      </h3>

      <div className="space-y-2.5">
        {policies.map((p, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{p.title}</h4>
                    <p className="text-[11px] font-medium text-slate-400">{p.subtitle}</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs font-medium text-slate-600 leading-relaxed border-t border-slate-50">
                  {p.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
