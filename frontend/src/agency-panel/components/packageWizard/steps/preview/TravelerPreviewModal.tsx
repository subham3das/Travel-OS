import React from 'react';
import { X, MapPin, Calendar, Check, X as XIcon, ShieldCheck } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

interface TravelerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TravelerPreviewModal: React.FC<TravelerPreviewModalProps> = ({ isOpen, onClose }) => {
  const { draft } = usePackageWizard();

  if (!isOpen) return null;

  const title = draft?.step1?.packageName || 'Ladakh Adventure Expedition';
  const description = draft?.step1?.shortDescription || '';
  const duration = draft?.step2?.durationPreset || '7 Days / 6 Nights';
  const primaryDest = draft?.step2?.primaryDestination || 'Leh, Ladakh';
  const price = draft?.step3?.discountedPrice || draft?.step3?.originalPrice || 16999;
  const coverImage =
    draft?.step5?.coverImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
  const gallery = draft?.step5?.galleryImages || [];
  const days = draft?.step4?.days || [];
  const inclusions = draft?.step6?.includedItems || [];
  const customInclusions = draft?.step6?.customIncludedItems || [];
  const exclusions = draft?.step6?.excludedItems || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-black text-[#583BE8] uppercase tracking-wider">Traveler Preview Mode</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Cover Hero */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200">
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="px-3 py-1 rounded-full bg-[#583BE8] text-white text-[11px] font-black uppercase w-fit mb-2">
                {draft?.step1?.packageType || 'Adventure'}
              </span>
              <h1 className="text-xl sm:text-3xl font-black">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#583BE8]" /> {primaryDest}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#583BE8]" /> {duration}</span>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Special Offer Price</p>
              <p className="text-2xl font-black text-[#583BE8]">₹{price.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ person</span></p>
            </div>
            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md hover:bg-[#472dbf] transition-all cursor-pointer"
            >
              Book Now
            </button>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-base font-black text-[#0F172A]">Trip Overview</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">{description}</p>
          </div>

          {/* Day Itinerary */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-[#0F172A]">Day by Day Itinerary</h3>
            <div className="space-y-2">
              {days.map((day) => (
                <div key={day.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#583BE8]">Day {day.dayNumber}</span>
                    <span className="text-xs font-extrabold text-[#0F172A]">• {day.title}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600">{day.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-[#0F172A]">What's Included</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {inclusions.map((inc) => (
                <div key={inc} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="capitalize">{inc.replace('_', ' ')}</span>
                </div>
              ))}
              {customInclusions.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelerPreviewModal;
