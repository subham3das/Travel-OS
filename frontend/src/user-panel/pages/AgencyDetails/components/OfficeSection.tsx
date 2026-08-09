import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { OfficeInfo } from '../../../types/agency';

interface OfficeSectionProps {
  agencyName: string;
  office: OfficeInfo;
  coordinates: { lat: number; lng: number };
}

export const OfficeSection: React.FC<OfficeSectionProps> = ({ agencyName, office, coordinates }) => {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(office.address || agencyName)}`;

  return (
    <div className="space-y-3.5">
      <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
        Office & Location
      </h3>

      <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Contact details */}
        <div className="p-5 md:w-1/2 space-y-3.5 border-b md:border-b-0 md:border-r border-slate-100 justify-between flex flex-col">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#6356E5] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Head Office</h5>
                <p className="text-xs font-medium text-slate-500">{office.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#6356E5] shrink-0" />
              <a href={`tel:${office.phone}`} className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#6356E5]">
                {office.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6356E5] shrink-0" />
              <a href={`mailto:${office.email}`} className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#6356E5]">
                {office.email}
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#6356E5] shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-slate-500">
                <p>{office.hours}</p>
              </div>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-50 hover:bg-[#6356E5] text-[#6356E5] hover:text-white font-bold text-xs transition-all w-full"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Right Column: Google Map Graphic */}
        <div className="relative md:w-1/2 h-56 md:h-auto bg-slate-100 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
            alt="Office Location Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="p-3 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center gap-2 text-xs font-bold text-[#0F172A]">
              <MapPin className="w-5 h-5 text-[#6356E5] fill-[#6356E5]/10" />
              <span>{agencyName} HQ ({coordinates.lat.toFixed(2)}, {coordinates.lng.toFixed(2)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
