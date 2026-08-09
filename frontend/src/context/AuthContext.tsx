import React, { createContext, useState, useEffect } from 'react';
import {
  User,
  OnboardingState,
  getOnboardingStateFromStorage,
  saveOnboardingStateToStorage,
  clearOnboardingStorage,
} from '../user-panel/utils/onboarding';

export interface AuthContextType extends OnboardingState {
  login: (userData: User) => void;
  signup: (userData: User) => void;
  completeProfile: (profileData: Partial<User>) => void;
  completePreferences: () => void;
  completeWelcome: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(getOnboardingStateFromStorage);

  useEffect(() => {
    saveOnboardingStateToStorage(state);
  }, [state]);

  const login = (userData: User) => {
    setState((prev) => {
      const newState = {
        ...prev,
        isLoggedIn: true,
        user: { ...prev.user, ...userData },
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const signup = (userData: User) => {
    setState((prev) => {
      const newState = {
        ...prev,
        isLoggedIn: true,
        user: { ...prev.user, ...userData },
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const completeProfile = (profileData: Partial<User>) => {
    setState((prev) => {
      const newState = {
        ...prev,
        hasCompletedProfile: true,
        user: prev.user ? { ...prev.user, ...profileData } : (profileData as User),
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const completePreferences = () => {
    setState((prev) => {
      const newState = {
        ...prev,
        hasCompletedPreferences: true,
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const completeWelcome = () => {
    setState((prev) => {
      const newState = {
        ...prev,
        hasSeenWelcome: true,
        hasCompletedOnboarding: true,
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const logout = () => {
    clearOnboardingStorage();
    setState({
      isLoggedIn: false,
      hasCompletedProfile: false,
      hasCompletedPreferences: false,
      hasSeenWelcome: false,
      hasCompletedOnboarding: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        completeProfile,
        completePreferences,
        completeWelcome,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
