import React from 'react';
import { PhoneCall, Phone } from 'lucide-react';
import { TripContact } from '../../data/staff';

interface EmergencyContactsCardProps {
  contacts: TripContact[];
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({ contacts }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-[#583BE8]" />
        <h3 className="text-sm font-extrabold text-[#0F172A]">Trip Contacts</h3>
      </div>

      <div className="divide-y divide-slate-100">
        {contacts.map((c) => (
          <div key={c.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-600 truncate">{c.title}</span>
            <a
              href={`tel:${c.phone}`}
              className="font-bold text-[#0F172A] hover:text-[#583BE8] flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>{c.phone}</span>
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContactsCard;
