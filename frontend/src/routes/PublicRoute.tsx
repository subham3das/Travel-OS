import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../user-panel/hooks/useAuth';

export const PublicRoute: React.FC = () => {
  const {
    isLoggedIn,
    hasCompletedProfile,
    hasCompletedPreferences,
    hasSeenWelcome,
    hasCompletedOnboarding,
  } = useAuth();

  if (isLoggedIn) {
    if (hasCompletedOnboarding) {
      return <Navigate to="/home" replace />;
    }
    if (!hasCompletedProfile) {
      return <Navigate to="/profile-setup" replace />;
    }
    if (!hasCompletedPreferences) {
      return <Navigate to="/travel-preferences" replace />;
    }
    if (!hasSeenWelcome) {
      return <Navigate to="/welcome" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
