import React from 'react';
import { PhoneCall, Phone, UserCheck, Hotel } from 'lucide-react';
import { QuickContact } from '../../data/travelers';

interface QuickContactsCardProps {
  contacts: QuickContact[];
}

export const QuickContactsCard: React.FC<QuickContactsCardProps> = ({ contacts }) => {
  const getIcon = (type: QuickContact['iconType']) => {
    switch (type) {
      case 'phone':
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-[#583BE8]" />
          </div>
        );
      case 'person':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
        );
      case 'hotel':
        return (
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
            <Hotel className="w-4 h-4 text-sky-700" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-1 select-none">
      <h3 className="text-sm font-extrabold text-[#0F172A] pb-2">Quick Contacts</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100/80 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {getIcon(c.iconType)}
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0F172A] truncate">{c.label}</p>
                <p className="text-[11px] font-semibold text-slate-400 truncate">{c.sublabel}</p>
                <p className="text-[11px] font-semibold text-slate-600 truncate">{c.phone}</p>
              </div>
            </div>

            <a
              href={`tel:${c.phone}`}
              className="w-9 h-9 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickContactsCard;
