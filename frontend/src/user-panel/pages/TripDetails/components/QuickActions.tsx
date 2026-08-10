import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, FileText, Headphones, FileSpreadsheet, MapPin, Image } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface QuickActionsProps {
  trip: Trip;
  onOpenInvoice?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ trip, onOpenInvoice }) => {
  const navigate = useNavigate();

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'itinerary': {
        const elem = document.getElementById('itinerary-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'documents':
        navigate(`/trips/${trip.id}/documents`);
        break;
      case 'contact':
        navigate(`/agencies/${trip.agency.id}`);
        break;
      case 'invoice':
        if (onOpenInvoice) onOpenInvoice();
        break;
      case 'maps':
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.locations)}`, '_blank');
        break;
      case 'gallery':
        navigate(`/destination/${trip.destinationId}`);
        break;
    }
  };

  const actions = [
    { id: 'itinerary', label: 'Itinerary', icon: <Map className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5 text-sky-600" />, bg: 'bg-sky-50' },
    { id: 'contact', label: 'Contact Agency', icon: <Headphones className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
    { id: 'invoice', label: 'Invoice', icon: <FileSpreadsheet className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
    { id: 'maps', label: 'Maps', icon: <MapPin className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50' },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Quick Actions
        </h2>
        <button
          onClick={() => navigate(`/trips/${trip.id}/documents`)}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-3 min-[540px]:grid-cols-6 gap-2.5">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => handleAction(act.id)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md hover:scale-[1.03] transition-all cursor-pointer text-center group"
          >
            <div className={`p-3 rounded-2xl ${act.bg} mb-1.5 group-hover:scale-105 transition-transform`}>
              {act.icon}
            </div>
            <span className="text-[11px] font-extrabold text-[#0F172A] leading-tight group-hover:text-[#6356E5] transition-colors">
              {act.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
