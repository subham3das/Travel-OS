import React, { useState } from 'react';
import { MapPin, Edit3 } from 'lucide-react';

export const BillingAddress: React.FC = () => {
  const [useTravelerAddress, setUseTravelerAddress] = useState(true);
  const [address, setAddress] = useState('123, MG Road, Shillong, Meghalaya – 793001');

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[#0F172A] tracking-tight">
          Billing Address
        </h2>
        <button
          onClick={() => {
            const newAdd = prompt('Edit Billing Address:', address);
            if (newAdd) setAddress(newAdd);
          }}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{address}</p>
          <p className="text-[11px] font-semibold text-slate-400">Same as traveler address</p>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={useTravelerAddress}
          onChange={(e) => setUseTravelerAddress(e.target.checked)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
        />
        <span className="text-xs font-bold text-slate-600">Use this address for billing</span>
      </label>
    </div>
  );
};
