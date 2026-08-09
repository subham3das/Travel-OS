import React from 'react';
import { FileText, Receipt, CreditCard, MapPin, Phone, ShieldAlert, Sparkles } from 'lucide-react';

interface QuickActionBarProps {
  onSelectTemplate: (templateText: string, templateType: string) => void;
}

export const TEMPLATE_OPTIONS = [
  {
    id: 'itinerary',
    label: 'Send Itinerary',
    icon: <FileText className="w-3.5 h-3.5 text-[#583BE8]" />,
    text: 'Hi! Here is your complete trip itinerary & schedule. Please check the details and let us know if you need any adjustments.',
  },
  {
    id: 'invoice',
    label: 'Send Invoice',
    icon: <Receipt className="w-3.5 h-3.5 text-emerald-600" />,
    text: 'Hello! Your tax invoice for booking has been generated and verified. Find the official receipt attached.',
  },
  {
    id: 'payment',
    label: 'Send Payment Link',
    icon: <CreditCard className="w-3.5 h-3.5 text-amber-600" />,
    text: 'Hi! You can complete your pending trip balance using our secure Travel OS payment gateway link: https://apnatrip.in/pay/bk-2024',
  },
  {
    id: 'meeting',
    label: 'Share Meeting Point',
    icon: <MapPin className="w-3.5 h-3.5 text-sky-600" />,
    text: 'Assembly & Pickup Point: Leh Airport Terminal 1 Gate B at 08:00 AM on May 15. Driver will hold ApnaTrip placard.',
  },
  {
    id: 'contact',
    label: 'Share Contact Number',
    icon: <Phone className="w-3.5 h-3.5 text-purple-600" />,
    text: 'Your Tour Manager contact: Ankit Verma (+91 87654 32100). Available 24/7 during your trip.',
  },
  {
    id: 'docs',
    label: 'Request Documents',
    icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
    text: 'Please upload or reply with clear scanned copies of your Aadhaar/Passport & Passport Photos for permit processing.',
  },
];

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onSelectTemplate }) => {
  return (
    <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none select-none">
      <span className="text-[10px] font-black uppercase text-[#583BE8] bg-purple-100 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Templates
      </span>

      {TEMPLATE_OPTIONS.map((tmpl) => (
        <button
          key={tmpl.id}
          type="button"
          onClick={() => onSelectTemplate(tmpl.text, tmpl.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-[#583BE8] text-xs font-extrabold border border-slate-200 hover:border-purple-200 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
        >
          {tmpl.icon}
          <span>{tmpl.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionBar;
