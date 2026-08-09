import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AboutSectionProps {
  agency: Agency;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ agency }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        {/* Left: Text */}
        <div className="space-y-2 flex-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            About {agency.name}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            {agency.description}
            {isExpanded && (
              <span className="block pt-2">
                Languages supported: <span className="font-extrabold text-slate-800">{agency.languages}</span>. With over {agency.yearsExperience} years of experience in {agency.location}, we specialize in {agency.specializationTags.join(', ')}.
              </span>
            )}
          </p>
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Intro Video Card */}
        <div className="relative w-full lg:w-96 h-48 sm:h-52 rounded-3xl overflow-hidden bg-slate-900 shadow-md group cursor-pointer shrink-0">
          <img
            src={agency.gallery[0] || agency.coverImage}
            alt="Intro Video"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#6356E5]/90 backdrop-blur-md text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
