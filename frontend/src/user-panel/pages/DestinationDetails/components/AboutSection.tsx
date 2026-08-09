import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface AboutSectionProps {
  destination: Destination;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ destination }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        About {destination.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
            {expanded
              ? `${destination.description} Famed for receiving the world's highest rainfall, Meghalaya features dramatic mountain cliffs, enchanting limestone caves, and ancient pine forests. Home to the matriarchal Khasi, Garo, and Jaintia communities, it offers an unmissable blend of culture and pristine nature.`
              : destination.description}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-extrabold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer focus:outline-none"
          >
            <span>{expanded ? 'Show Less' : 'Read More'}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="md:col-span-4 relative h-36 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={destination.gallery[0] || destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
