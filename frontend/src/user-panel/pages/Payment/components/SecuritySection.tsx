import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Shield } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const badges = [
    { title: 'SSL 256-bit', subtitle: 'Encrypted', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
    { title: 'PCI DSS', subtitle: 'Level 1 Certified', icon: <CheckCircle2 className="w-4 h-4 text-[#6356E5]" />, bg: 'bg-purple-50 border-purple-100' },
    { title: 'Razorpay', subtitle: 'Verified Gateway', icon: <Shield className="w-4 h-4 text-sky-600" />, bg: 'bg-sky-50 border-sky-100' },
    { title: 'Bank Grade', subtitle: 'Fraud Protection', icon: <Lock className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <h2 className="text-sm font-black text-[#0F172A] tracking-tight uppercase">
          Guaranteed Secure Checkout
        </h2>
      </div>

      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-2.5">
        {badges.map((b, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5 hover:shadow-soft transition-all"
          >
            <div className={`w-8 h-8 rounded-xl ${b.bg} border flex items-center justify-center shrink-0`}>
              {b.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-[#0F172A] truncate">{b.title}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecuritySection;
