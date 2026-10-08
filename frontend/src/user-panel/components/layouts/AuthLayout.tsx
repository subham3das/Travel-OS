import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Compass, Users } from 'lucide-react';
import authHeroBg from '../../../assets/bg loginsignup.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
  showHeroBadge?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heroTitle = 'Start your journey with amazing experiences',
  heroSubtitle = 'Connect with real travelers, discover hidden gems, and book unforgettable trips.',
  showHeroBadge = true,
}) => {
  return (
    <div className="min-h-screen w-full lg:h-screen lg:w-screen lg:overflow-hidden bg-white flex flex-col justify-center items-center p-0 m-0">
      {/* Full Screen Edge-to-Edge Container on Desktop */}
      <div className="w-full h-full min-h-screen lg:min-h-0 bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Desktop Branding & Visual Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-950 text-white relative p-10 xl:p-14 flex-col justify-between overflow-hidden border-r border-slate-100/10">
          {/* Background Gradient & Photo Artwork Overlay (Clean scenic photography without ghost text) */}
          <div className="absolute inset-0 z-0">
            <img
              src={authHeroBg}
              alt="ApnaTrip Travel Showcase"
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 z-0" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <Logo variant="dark" size="sm" />
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 my-auto py-8">
            {showHeroBadge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-200 mb-6">
                <Compass className="w-4 h-4 text-[#FF4D6D]" />
                <span>#1 Travel & Car Rental Platform</span>
              </div>
            )}

            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight mb-4">
              {heroTitle}
            </h2>
            
            <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-8 max-w-md">
              {heroSubtitle}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">250k+ Travelers</p>
                  <p className="text-[11px] text-slate-400">Verified Explorers</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Verified Trips</p>
                  <p className="text-[11px] text-slate-400">100% Trusted Agencies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Banner */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-slate-300">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-rose-400 border-2 border-slate-900" />
              <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-slate-900" />
              <div className="w-7 h-7 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <span>Joined by 10,000+ new travelers this month</span>
          </div>
        </div>

        {/* Right Side: Auth Screen Content (Mobile + Desktop) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-between h-full bg-white relative overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
