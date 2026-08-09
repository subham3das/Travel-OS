import React, { useState } from 'react';
import { MapPin, Edit3, CheckCircle2 } from 'lucide-react';

export const BillingAddress: React.FC = () => {
  const [useTravelerAddress, setUseTravelerAddress] = useState(true);
  const [address, setAddress] = useState('123, MG Road, Shillong, Meghalaya – 793001');

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all space-y-3.5 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center font-extrabold shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-[#0F172A] tracking-tight">
            Billing Address
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            const newAdd = prompt('Edit Billing Address:', address);
            if (newAdd) setAddress(newAdd);
          }}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-xs font-black text-[#6356E5] transition-all flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Address</span>
        </button>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
        <MapPin className="w-4 h-4 text-[#6356E5] mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-extrabold text-[#0F172A] leading-snug">{address}</p>
          <p className="text-[11px] font-bold text-slate-400">Primary traveler GST billing address</p>
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={useTravelerAddress}
          onChange={(e) => setUseTravelerAddress(e.target.checked)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-[#6356E5] cursor-pointer accent-[#6356E5]"
        />
        <span className="text-xs font-bold text-slate-600">Use lead traveler address for GST invoice</span>
      </label>
    </div>
  );
};

export default BillingAddress;
