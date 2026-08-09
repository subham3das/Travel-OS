import React from 'react';

export interface EmergencyContactData {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactProps {
  data: EmergencyContactData;
  onChange: (field: keyof EmergencyContactData, value: string) => void;
  errors?: Partial<Record<keyof EmergencyContactData, string>>;
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Emergency Contact
      </h2>

      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Contact Person Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Vikram Sharma"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                errors.name ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
              } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors`}
            />
            {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Relationship <span className="text-rose-500">*</span>
            </label>
            <select
              value={data.relationship}
              onChange={(e) => onChange('relationship', e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-[#6356E5] text-sm font-extrabold text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+91 91234 56789"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                errors.phone ? 'border-rose-500' : 'border-slate-200 focus:border-[#6356E5]'
              } text-sm font-extrabold text-[#0F172A] focus:outline-none transition-colors`}
            />
            {errors.phone && <p className="text-[10px] font-bold text-rose-500">{errors.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
