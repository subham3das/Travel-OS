import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, CheckCircle2, Lock } from 'lucide-react';
import { getUserReputation } from '../../data/reputation';

export const TravelerReputationCard: React.FC = () => {
  const profile = getUserReputation();

  return (
    <div className="bg-[#0F172A] rounded-3xl p-5 text-white shadow-xl space-y-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traveler Reputation</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">
                ⭐ {profile.reputation} Reputation
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#6356E5]/20 border border-[#6356E5]/40 text-[#A594FF] text-xs font-black uppercase tracking-wider">
          {profile.levelTitle}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
        <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-base font-black text-white">{profile.completedTrips}</p>
          <p className="text-[10px] font-bold text-slate-400">Trips</p>
        </div>
        <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-base font-black text-emerald-400">{profile.reviewCount}</p>
          <p className="text-[10px] font-bold text-slate-400">Reviews</p>
        </div>
        <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-base font-black text-purple-400">{profile.recommendationCount}</p>
          <p className="text-[10px] font-bold text-slate-400">Recommended</p>
        </div>
        <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-base font-black text-sky-400">{profile.storyCount}</p>
          <p className="text-[10px] font-bold text-slate-400">Stories</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Unlocked Badges ({profile.badges.filter((b) => b.unlocked).length}/{profile.badges.length})</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {profile.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all ${
                badge.unlocked
                  ? 'bg-slate-900/90 border-slate-700 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50'
              }`}
            >
              <span className="text-lg">{badge.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold truncate">{badge.name}</p>
                <p className="text-[9px] font-medium text-slate-400 truncate">
                  {badge.unlocked ? badge.unlockedAt || 'Unlocked' : 'Locked'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
