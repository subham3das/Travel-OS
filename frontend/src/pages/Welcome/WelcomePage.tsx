import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Map, Heart, ChevronRight, Plane } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { completeWelcome, user: authUser } = useAuth();

  // 2-second automatic timer to navigate to /home
  useEffect(() => {
    const timer = setTimeout(() => {
      completeWelcome();
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [completeWelcome, navigate]);

  const handleContinue = () => {
    completeWelcome();
    navigate('/home');
  };

  const storedUser = localStorage.getItem('apnatrip_user');
  const user = authUser || (storedUser
    ? JSON.parse(storedUser)
    : { name: 'Subham Das', location: 'Dibrugarh, Assam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' });

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col justify-between items-center relative overflow-hidden font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Decorative Background Hot Air Balloons */}
      <div className="absolute top-12 left-6 opacity-40 pointer-events-none animate-bounce duration-3000">
        <span className="text-3xl">🎈</span>
      </div>
      <div className="absolute top-28 right-8 opacity-30 pointer-events-none animate-pulse">
        <span className="text-4xl">🎈</span>
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-md sm:max-w-lg mx-auto px-5 py-8 sm:py-12 z-10 flex flex-col items-center text-center space-y-6">
        {/* 🎉 Party Popper Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-4xl sm:text-5xl"
        >
          🎉
        </motion.div>

        {/* Greeting Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Welcome to ApnaTrip! 👋
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
            Hey there! We’re excited to have you on board.
            <br />
            Your travel journey starts here. ❤️
          </p>
        </motion.div>

        {/* Large Profile Picture & Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center space-y-2"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-xl font-black text-[#0F172A] tracking-tight">{user.name}</h3>
            <p className="text-xs font-semibold text-slate-400">
              📍 {user.location || 'Dibrugarh, Assam'}
            </p>
          </div>
        </motion.div>

        {/* Heart Welcome Note Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full bg-rose-50/80 border border-rose-100 p-4 rounded-2xl flex items-center gap-3.5 text-left shadow-2xs"
        >
          <div className="w-10 h-10 rounded-full bg-white text-[#FF4D6D] flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-5 h-5 fill-[#FF4D6D]" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
              Thanks for being a part of our community.
            </h4>
            <p className="text-xs font-medium text-slate-500">
              Let’s explore the world together!
            </p>
          </div>
        </motion.div>

        {/* Section Divider */}
        <div className="w-full flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Here’s what you can do now
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Quick Action List Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full space-y-3"
        >
          {/* Tile 1: Discover */}
          <div
            onClick={() => navigate('/explore')}
            className="w-full bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
                  Discover Amazing Places
                </h4>
                <p className="text-[11px] font-medium text-slate-400 leading-snug">
                  Find hidden gems and popular destinations.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </div>

          {/* Tile 2: Connect */}
          <div
            onClick={() => navigate('/community')}
            className="w-full bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
                  Connect with Travelers
                </h4>
                <p className="text-[11px] font-medium text-slate-400 leading-snug">
                  Share experiences and get inspired by real travelers.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </div>

          {/* Tile 3: Plan */}
          <div
            onClick={() => navigate('/my-trips')}
            className="w-full bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
                  Plan Your Trips
                </h4>
                <p className="text-[11px] font-medium text-slate-400 leading-snug">
                  Save places, create itineraries and make every trip memorable.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </div>
        </motion.div>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full pt-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3355] text-white text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/25 hover:shadow-xl transition-all focus:outline-none cursor-pointer"
          >
            <span>Let’s Explore</span>
            <Plane className="w-5 h-5 rotate-45" />
          </motion.button>
        </motion.div>
      </main>

      {/* Bottom Mountain & Lake Landscape Vector Backdrop */}
      <div className="w-full relative h-36 sm:h-48 overflow-hidden pointer-events-none mt-4">
        <svg className="w-full h-full object-cover text-rose-100/60 fill-current" viewBox="0 0 1440 320">
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomePage;
