import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, PhoneCall, Phone } from 'lucide-react';

interface EmergencyContactCardProps {
  packageId: string;
  name?: string;
  relationship?: string;
  phone?: string;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  packageId,
  name = 'Vikram Sharma',
  relationship = 'Brother',
  phone = '+91 91234 56789',
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Emergency Contact
        </h2>
        <button
          onClick={() => navigate(`/booking/traveler-details/${packageId}`)}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-[#6356E5]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
              {name} <span className="text-slate-400 font-semibold">({relationship})</span>
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">{phone}</p>
          </div>
        </div>

        <a
          href={`tel:${phone}`}
          className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Call emergency contact"
        >
          <PhoneCall className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
