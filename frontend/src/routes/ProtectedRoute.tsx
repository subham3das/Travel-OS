import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const {
    isLoggedIn,
    hasCompletedProfile,
    hasCompletedPreferences,
    hasSeenWelcome,
    hasCompletedOnboarding,
  } = useAuth();

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
