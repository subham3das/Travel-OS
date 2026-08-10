import React from 'react';
import { Smartphone, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AppDownloadBanner: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="w-full bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-purple-100/50 relative overflow-hidden shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6356E5]/10 text-[#6356E5] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ApnaTrip Mobile App</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Book Trips on the Go
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
            Download the app for the best experience, exclusive deals and easy bookings.
          </p>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Google Play */}
          <button
            onClick={() => showToast('ApnaTrip Android App release coming soon!', 'info')}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md transition-all focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M3.6 1.8l10.3 10.3-3.2 3.2L1.5 5.8C.8 5 .8 3.5 1.5 2.7l2.1-.9z"
              />
              <path fill="#FBBC05" d="M13.9 12.1L18 8c.9-.5 2-.2 2.5.7l.2.4L3.6 1.8l10.3 10.3z" />
              <path fill="#4285F4" d="M3.6 22.2L18 16c.9-.5 1.2-1.6.7-2.5l-.2-.4-4.6 4.6-10.3 4.5z" />
              <path fill="#34A853" d="M10.7 15.3l3.2 3.2L3.6 22.2l7.1-6.9z" />
            </svg>
            <div className="text-left leading-none">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                GET IT ON
              </p>
              <p className="text-xs font-bold text-[#0F172A] mt-0.5">Google Play</p>
            </div>
          </button>

          {/* Apple App Store */}
          <button
            onClick={() => showToast('ApnaTrip iOS App release coming soon!', 'info')}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md transition-all focus:outline-none cursor-pointer"
          >
            <Smartphone className="w-5 h-5 text-slate-800" />
            <div className="text-left leading-none">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Download on the
              </p>
              <p className="text-xs font-bold text-[#0F172A] mt-0.5">App Store</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
