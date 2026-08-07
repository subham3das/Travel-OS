import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, UserPlus, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

export const TravelerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  const traveler = {
    name: 'Ananya Sharma',
    username: '@ananya_wild',
    isVerified: true,
    bio: 'Passionate solo traveler & high-altitude trekking guide. 24 countries explored & counting!',
    location: 'Guwahati, Assam',
    memberSince: 'Member since 2023',
    tripsCount: 24,
    followersCount: 1240,
    followingCount: 380,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">{traveler.username}</h2>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs text-center space-y-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-rose-50 shadow-md">
            <img src={traveler.avatar} alt={traveler.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-xl font-extrabold text-[#0F172A]">{traveler.name}</h3>
              {traveler.isVerified && <CheckCircle2 className="w-5 h-5 text-[#FF4D6D]" />}
            </div>
            <p className="text-xs font-semibold text-slate-400">{traveler.username} • {traveler.location}</p>
            <p className="text-xs font-medium text-slate-600 max-w-md mx-auto pt-1">{traveler.bio}</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 text-center">
            <div>
              <p className="text-base font-black text-[#0F172A]">{traveler.tripsCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Trips</p>
            </div>
            <div className="border-x border-slate-100">
              <p className="text-base font-black text-[#0F172A]">{traveler.followersCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-base font-black text-[#0F172A]">{traveler.followingCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Following</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsFollowing((p) => !p)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                isFollowing ? 'bg-slate-100 text-slate-700' : 'bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20'
              }`}
            >
              {isFollowing ? 'Following' : '+ Follow Traveler'}
            </button>
            <button
              onClick={() => navigate('/chat/traveler-1')}
              className="px-6 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold"
            >
              Message
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelerProfilePage;
