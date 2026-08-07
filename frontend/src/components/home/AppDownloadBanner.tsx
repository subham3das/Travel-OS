import React from 'react';
import { Logo } from '../common/Logo';

export const AppDownloadBanner: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-sky-50/90 via-blue-50/80 to-slate-50/90 p-6 sm:p-8 md:p-10 border border-sky-100 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Content */}
        <div className="md:col-span-7 space-y-4">
          <Logo size="sm" variant="dark" />

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Travel better with ApnaTrip
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Download the app for the best experience, exclusive deals and easy bookings.
            </p>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Google Play */}
            <button
              onClick={() => alert('App Store release coming soon!')}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md transition-all focus:outline-none"
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
              onClick={() => alert('App Store release coming soon!')}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md transition-all focus:outline-none"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-1 .04-2.18.67-2.88 1.48-.63.73-1.18 1.89-1.03 3.03 1.11.09 2.25-.56 2.92-1.39z" />
              </svg>
              <div className="text-left leading-none">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Download on the
                </p>
                <p className="text-xs font-bold text-[#0F172A] mt-0.5">App Store</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Phone Mockup Graphic */}
        <div className="md:col-span-5 flex justify-center md:justify-end relative">
          <div className="w-48 sm:w-56 h-64 bg-slate-900 rounded-3xl p-2.5 shadow-2xl ring-4 ring-slate-800/20 transform rotate-2">
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden p-3 flex flex-col items-center justify-center text-center space-y-3">
              <Logo size="md" variant="dark" />
              <p className="text-xs font-bold text-slate-600">Your Ultimate Travel Companion</p>
              <span className="text-[10px] px-3 py-1 bg-[#FF4D6D]/10 text-[#FF4D6D] font-bold rounded-full">
                4.9 ★★★★★
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
