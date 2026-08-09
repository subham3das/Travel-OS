import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Award, MapPin, ShieldCheck, Headphones } from 'lucide-react';

interface AgencyTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const AgencyTabs: React.FC<AgencyTabsProps> = ({ activeTab, onTabChange }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainTabs = [
    { id: 'about', label: 'About', sectionId: 'about-section' },
    { id: 'packages', label: 'Packages', sectionId: 'packages-section' },
    { id: 'itinerary', label: 'Itinerary', sectionId: 'itinerary-section' },
    { id: 'reviews', label: 'Reviews', sectionId: 'reviews-section' },
    { id: 'gallery', label: 'Gallery', sectionId: 'gallery-section' },
    { id: 'team', label: 'Team', sectionId: 'team-section' },
  ];

  const moreTabs = [
    { id: 'certifications', label: 'Certifications', sectionId: 'certifications-section', icon: <Award className="w-4 h-4 text-purple-600" /> },
    { id: 'office', label: 'Office & Location', sectionId: 'office-section', icon: <MapPin className="w-4 h-4 text-rose-500" /> },
    { id: 'policies', label: 'Policies & Terms', sectionId: 'policies-section', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { id: 'support', label: '24/7 Customer Support', sectionId: 'support-section', icon: <Headphones className="w-4 h-4 text-sky-600" /> },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tabId: string, sectionId: string) => {
    onTabChange(tabId);
    setIsMoreOpen(false);

    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -90; // Offset for sticky header & tabs bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isMoreActive = moreTabs.some((t) => t.id === activeTab) || activeTab === 'more';

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100/90 -mx-4 px-4 sm:mx-0 sm:px-0 shadow-2xs select-none">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1 flex-1">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id, tab.sectionId)}
                className={`py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all whitespace-nowrap focus:outline-none flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'border-[#583BE8] text-[#583BE8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all whitespace-nowrap focus:outline-none flex items-center gap-1 cursor-pointer ${
                isMoreActive
                  ? 'border-[#583BE8] text-[#583BE8]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMoreOpen && (
              <div className="absolute right-0 sm:left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {moreTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id, tab.sectionId)}
                    className="w-full p-2.5 rounded-xl hover:bg-purple-50/70 text-slate-700 hover:text-[#583BE8] text-xs font-extrabold flex items-center gap-2.5 transition-all text-left cursor-pointer"
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyTabs;
