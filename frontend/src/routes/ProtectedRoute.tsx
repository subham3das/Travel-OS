import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../user-panel/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const {
    isLoggedIn,
    hasCompletedProfile,
    hasCompletedPreferences,
    hasSeenWelcome,
    hasCompletedOnboarding,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="w-8 h-8 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!hasCompletedOnboarding) {
    if (!hasCompletedProfile) {
      return <Navigate to="/profile-setup" replace />;
    }
    if (!hasCompletedPreferences) {
      return <Navigate to="/travel-preferences" replace />;
    }
    if (!hasSeenWelcome) {
      return <Navigate to="/welcome" replace />;
    }
  }

  return <Outlet />;
};
