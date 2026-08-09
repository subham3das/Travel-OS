import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export interface LeadTravelerData {
  fullName: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
}

interface LeadTravelerFormProps {
  data: LeadTravelerData;
  onChange: (field: keyof LeadTravelerData, value: string) => void;
  errors?: Partial<Record<keyof LeadTravelerData, string>>;
}

export const LeadTravelerForm: React.FC<LeadTravelerFormProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Lead Traveler
        </h2>
        <span className="text-xs font-semibold text-slate-400">(Primary Contact)</span>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
        {/* Row 1: Full Name & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                errors.fullName ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
              } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors`}
            />
            {errors.fullName && <p className="text-[10px] font-bold text-rose-500">{errors.fullName}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-[#6356E5] text-sm font-extrabold text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: DOB & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.dob}
                onChange={(e) => onChange('dob', e.target.value)}
                placeholder="DD/MM/YYYY"
                className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                  errors.dob ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
                } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors pr-10`}
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.dob && <p className="text-[10px] font-bold text-rose-500">{errors.dob}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                errors.phone ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
              } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors`}
            />
            {errors.phone && <p className="text-[10px] font-bold text-rose-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Row 3: Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="rahulsharma@gmail.com"
            className={`w-full px-4 py-3 rounded-2xl bg-white border ${
              errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
            } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors`}
          />
          {errors.email && <p className="text-[10px] font-bold text-rose-500">{errors.email}</p>}
        </div>

        {/* Row 4: Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">
            Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="123, MG Road, Shillong, Meghalaya"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                errors.address ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
              } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors pr-10`}
            />
            <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.address && <p className="text-[10px] font-bold text-rose-500">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};
