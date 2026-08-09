import React from 'react';
import { CreditCard, Lock, ShieldCheck, Zap, Shield } from 'lucide-react';

export const SecureCheckoutCard: React.FC = () => {
  const trustFeatures = [
    { label: 'Multiple Payment Options', icon: <CreditCard className="w-4 h-4 text-[#6356E5]" /> },
    { label: 'Bank-grade Encryption', icon: <Lock className="w-4 h-4 text-emerald-600" /> },
    { label: 'PCI DSS Certified', icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> },
    { label: 'Instant Booking Confirmation', icon: <Zap className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-[#6356E5]" />
            <span>Secure Checkout</span>
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Powered by <span className="text-[#0C2340] font-black italic">Razorpay</span>
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 shrink-0">
          <Shield className="w-4 h-4 text-[#6356E5]" />
          <span className="text-xs font-black text-[#0C2340] italic">Razorpay</span>
        </div>
      </div>

      {/* 4 Trust Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {trustFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100/80 text-xs font-extrabold text-slate-700"
          >
            <div className="p-1.5 rounded-xl bg-white shadow-2xs shrink-0">
              {feat.icon}
            </div>
            <span>{feat.label}</span>
          </div>
        ))}
      </div>

      {/* Small Note */}
      <p className="text-xs font-semibold text-slate-500 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/60 leading-relaxed">
        You'll be redirected to Razorpay's secure checkout where you can pay using UPI, Cards, Net Banking, Wallets, EMI, and other supported methods.
      </p>
    </div>
  );
};
