import React from 'react';
import { Phone, PhoneCall, Mail } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const EmergencyContactCard: React.FC = () => {
  const { draft, updateStep7 } = usePackageWizard();

  const emergency = draft?.step7?.emergencyContact || {
    phone: '+91 98765 43210',
    alternatePhone: '+91 91234 56789',
    email: 'support@mountroam.com',
    is24x7: true,
  };

  const handleChange = (field: string, value: any) => {
    updateStep7({
      emergencyContact: {
        ...emergency,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="space-y-0.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Emergency Contact <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs font-semibold text-slate-400">Provide emergency contact information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Agency Emergency Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500">Agency Emergency Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={emergency.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          </div>
        </div>

        {/* Alternate Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500">Alternate Number</label>
          <div className="relative">
            <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={emergency.alternatePhone}
              onChange={(e) => handleChange('alternatePhone', e.target.value)}
              placeholder="+91 91234 56789"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          </div>
        </div>

        {/* Support Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500">Support Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={emergency.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="support@mountroam.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
          </div>
        </div>

        {/* 24x7 Availability */}
        <div className="space-y-1 flex flex-col justify-end">
          <div className="p-2.5 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#0F172A]">24×7 Availability</span>
            <button
              type="button"
              onClick={() => handleChange('is24x7', !emergency.is24x7)}
              className={`w-11 h-6 rounded-full flex items-center transition-all cursor-pointer ${
                emergency.is24x7 ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-md" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactCard;
