import React from 'react';
import { Check, CreditCard, Building2, Wallet, Clock, QrCode } from 'lucide-react';

export interface PaymentMethodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const options: PaymentMethodOption[] = [
    { id: 'upi', name: 'UPI', icon: <QrCode className="w-4 h-4 text-[#6356E5]" /> },
    { id: 'card', name: 'Card', icon: <CreditCard className="w-4 h-4 text-slate-700" /> },
    { id: 'netbanking', name: 'Net Banking', icon: <Building2 className="w-4 h-4 text-slate-700" /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="w-4 h-4 text-slate-700" /> },
    { id: 'paylater', name: 'Pay Later', icon: <Clock className="w-4 h-4 text-slate-700" /> },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Payment Method
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {options.map((opt) => {
          const isSelected = selectedMethod === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              className={`relative px-4 py-3.5 rounded-2xl border transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-[#6356E5] shadow-md shadow-[#6356E5]/10'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#6356E5] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="p-1 rounded-lg bg-slate-50">{opt.icon}</div>
              <span
                className={`text-xs font-extrabold whitespace-nowrap ${
                  isSelected ? 'text-[#6356E5]' : 'text-[#0F172A]'
                }`}
              >
                {opt.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
