import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

export const SupportSection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <h4 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Have Questions?</h4>
        <p className="text-xs font-medium text-slate-500">
          We're here to help you plan your perfect trip.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>

        <a
          href="tel:+919876543210"
          className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Phone className="w-4 h-4" />
          <span>Call Us Now</span>
        </a>
      </div>
    </div>
  );
};
