import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';

interface CertificationSectionProps {
  certifications: { title: string; subtitle: string; badge: string; variant?: 'green' | 'blue' | 'purple' | 'amber' }[];
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Certifications & Registrations
        </h3>
        <button
          onClick={() => alert('Certificate verification docs coming soon!')}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {certifications.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-3.5 border border-slate-100/90 shadow-2xs text-center space-y-2 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <h5 className="text-xs font-extrabold text-[#0F172A] leading-snug">{c.title}</h5>
              <p className="text-[10px] font-medium text-slate-400">{c.subtitle}</p>
            </div>

            <span className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-3 h-3" /> {c.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
