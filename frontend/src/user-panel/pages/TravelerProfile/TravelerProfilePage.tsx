import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Award,
  Calendar,
  Compass,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import apiClient from '../../../services/apiClient';

export const TravelerProfilePage: React.FC = () => {
  const { userId, id } = useParams<{ userId?: string; id?: string }>();
  const targetId = userId || id || '';
  const navigate = useNavigate();

  const [traveler, setTraveler] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!targetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch public profile from API or fallback
    apiClient
      .get<any>(`/users/${encodeURIComponent(targetId)}/public-profile`)
      .then((res: any) => {
        if (isMounted && res?.data?.profile) {
          setTraveler(res.data.profile);
          setLoading(false);
        } else {
          throw new Error('Public profile endpoint not available');
        }
      })
      .catch(() => {
        if (isMounted) {
          setTraveler(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-500">Loading traveler profile...</p>
      </div>
    );
  }

  if (!traveler) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-2xl">✕</div>
        <h2 className="text-xl font-black text-[#0F172A]">Traveler Not Found</h2>
        <p className="text-xs font-semibold text-slate-500 max-w-sm">
          This traveler profile could not be loaded or the server is unavailable.
        </p>
        <button onClick={() => navigate('/home')} className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/search'))}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-[#0F172A] leading-tight">
              Traveler Profile
            </h1>
            <p className="text-[11px] font-semibold text-slate-400">
              @{traveler?.username || 'traveler'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black transition-colors cursor-pointer shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Message</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-5 text-center sm:text-left flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="relative">
            <img
              src={traveler?.avatar}
              alt={traveler?.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            {traveler?.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-[#0F172A]">{traveler?.fullName}</h2>
                <p className="text-xs font-bold text-[#6356E5]">@{traveler?.username}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6356E5] text-[11px] font-black border border-purple-100 self-center sm:self-auto">
                Verified Explorer
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
              <span>{traveler?.homeCity}</span>
            </p>

            <p className="text-xs font-medium text-slate-600 pt-1 leading-relaxed">
              {traveler?.bio}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3 text-center"
        >
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
            <span className="text-xl font-black text-[#583BE8] block">{traveler?.tripsCompleted || 18}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Trips Completed</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
            <span className="text-xl font-black text-emerald-600 block">{traveler?.statesVisited || 12}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">States Visited</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
            <span className="text-xl font-black text-amber-500 block">{traveler?.rating || 4.9} ★</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Reputation</span>
          </div>
        </motion.div>

        {/* Earned Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-[#583BE8]" />
            <h3 className="text-sm font-black text-[#0F172A]">Traveler Achievements & Badges</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(traveler?.badges || []).map((b: any, i: number) => (
              <div key={`traveler-badge-${b.name || i}-${i}`} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#0F172A]">{b.name}</h4>
                  <p className="text-[10px] font-medium text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TravelerProfilePage;
