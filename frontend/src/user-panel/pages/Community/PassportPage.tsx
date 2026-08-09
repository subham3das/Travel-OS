import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, MapPin, Globe, Sparkles, ShieldCheck } from 'lucide-react';

export const PassportPage: React.FC = () => {
  const navigate = useNavigate();

  const badges = [
    { title: 'Himalayan Conqueror', desc: 'Completed 5 High-Altitude Treks', icon: '🏔️' },
    { title: 'Northeast Trailblazer', desc: 'Visited 4 States in Northeast India', icon: '🌿' },
    { title: 'Verified Explorer', desc: 'Government Identity Verified', icon: '⚡' },
    { title: 'Community Champion', desc: '50+ Helpful Reviews Written', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Traveler Passport</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Passport Badge Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">ApnaTrip Passport</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black">Subham Das</h3>
            <p className="text-xs text-slate-300">ID: AT-9821-EXP</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-bold border-t border-white/10">
            <div>
              <p className="text-[10px] text-slate-400">States Covered</p>
              <p className="text-lg font-black text-amber-300">12</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-[10px] text-slate-400">Total KM Travelled</p>
              <p className="text-lg font-black text-amber-300">14,200</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Trust Score</p>
              <p className="text-lg font-black text-emerald-400">98%</p>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-[#0F172A]">Earned Achievements & Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center gap-3">
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#0F172A]">{b.title}</h4>
                  <p className="text-[11px] font-medium text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassportPage;
