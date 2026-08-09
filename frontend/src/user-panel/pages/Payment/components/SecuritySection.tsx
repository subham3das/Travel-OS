import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Shield } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const badges = [
    { title: 'SSL', subtitle: 'Secure', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' },
    { title: 'PCI DSS', subtitle: 'Certified', icon: <CheckCircle2 className="w-4 h-4 text-[#6356E5]" />, bg: 'bg-purple-50' },
    { title: 'Razorpay', subtitle: 'Secured', icon: <Shield className="w-4 h-4 text-sky-500" />, bg: 'bg-sky-50' },
    { title: '256-bit', subtitle: 'Encryption', icon: <Lock className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-2.5">
      <h2 className="text-base font-black text-[#0F172A] tracking-tight">
        Secure & Trusted
      </h2>

      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-2.5">
        {badges.map((b, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5"
          >
            <div className={`w-8 h-8 rounded-xl ${b.bg} flex items-center justify-center shrink-0`}>
              {b.icon}
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">{b.title}</p>
              <p className="text-[10px] font-semibold text-slate-400">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
