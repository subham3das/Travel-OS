import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  const leaders = [
    { rank: 1, name: 'Ananya Sharma', points: '14,500 pts', badge: '🥇 Top Explorer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
    { rank: 2, name: 'Rohan Verma', points: '12,200 pts', badge: '🥈 Trek Master', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
    { rank: 3, name: 'Subham Das', points: '10,800 pts', badge: '🥉 Pioneer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Community Leaderboard</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Top community contributors win free monthly travel vouchers!</span>
        </div>

        <div className="space-y-3">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              onClick={() => navigate(`/traveler/trv-${leader.rank}`)}
              className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-100 font-black text-slate-800 flex items-center justify-center text-xs">
                  #{leader.rank}
                </span>
                <img src={leader.avatar} alt={leader.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-extrabold text-[#0F172A]">{leader.name}</h4>
                  <span className="text-[11px] font-bold text-[#FF4D6D]">{leader.badge}</span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-slate-700">{leader.points}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
