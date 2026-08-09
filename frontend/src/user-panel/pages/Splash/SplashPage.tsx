import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    hasCompletedProfile,
    hasCompletedPreferences,
    hasSeenWelcome,
    hasCompletedOnboarding,
  } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (hasCompletedOnboarding) {
          navigate('/home');
        } else if (!hasCompletedProfile) {
          navigate('/profile-setup');
        } else if (!hasCompletedPreferences) {
          navigate('/travel-preferences');
        } else if (!hasSeenWelcome) {
          navigate('/welcome');
        } else {
          navigate('/home');
        }
      } else {
        navigate('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    navigate,
    isLoggedIn,
    hasCompletedProfile,
    hasCompletedPreferences,
    hasSeenWelcome,
    hasCompletedOnboarding,
  ]);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-rose-100/50 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />

      {/* Main Animated Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 p-6 flex flex-col items-center"
      >
        <Logo size="lg" showSubtitle />
      </motion.div>

      {/* Footer Branding Loading Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-12 z-10 flex items-center gap-1.5"
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0 }}
          className="w-2 h-2 rounded-full bg-[#FF4D6D]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-[#FF4D6D]/60"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-[#FF4D6D]/30"
        />
      </motion.div>
    </div>
  );
};
