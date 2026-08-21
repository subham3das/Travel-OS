import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  OnboardingState,
  getOnboardingStateFromStorage,
  saveOnboardingStateToStorage,
  clearOnboardingStorage,
} from '../user-panel/utils/onboarding';
import { userAuthService, UserAuthResponse } from '../user-panel/services/userAuth.service';

export interface AuthContextType extends OnboardingState {
  login: (userData: Partial<User> & { id?: string }) => void;
  signup: (userData: Partial<User> & { id?: string }) => void;
  setAuthenticatedUser: (user: UserAuthResponse) => void;
  completeProfile: (profileData: Partial<User>) => void;
  completePreferences: () => void;
  completeWelcome: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(getOnboardingStateFromStorage);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state to storage
  useEffect(() => {
    saveOnboardingStateToStorage(state);
  }, [state]);

  // Synchronize authenticated user from backend on initial load / refresh
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('apnatrip_access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const liveUser = await userAuthService.getMe();
      if (liveUser) {
        setAuthenticatedUser(liveUser);
      } else {
        logout();
      }
    } catch {
      // If token is invalid or user deleted, log out
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const setAuthenticatedUser = (user: UserAuthResponse) => {
    setState({
      isLoggedIn: true,
      hasCompletedProfile: Boolean(user.profileCompleted),
      hasCompletedPreferences: Boolean(user.preferenceCompleted),
      hasSeenWelcome: Boolean(user.onboardingCompleted),
      hasCompletedOnboarding: Boolean(user.onboardingCompleted),
      user: {
        id: user.id,
        name: user.fullName || 'Traveler',
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || user.profileImage || '',
      },
    });
  };

  const login = (userData: Partial<User> & { id?: string }) => {
    setState((prev) => {
      const newState: OnboardingState = {
        ...prev,
        isLoggedIn: true,
        user: prev.user
          ? { ...prev.user, ...userData, name: userData.name || prev.user.name }
          : ({
              name: userData.name || 'Traveler',
              email: userData.email,
              phone: userData.phone,
              avatar: userData.avatar,
              id: userData.id,
            } as User),
      };
      saveOnboardingStateToStorage(newState);
      return newState;
    });
  };

  const signup = (userData: Partial<User> & { id?: string }) => {
    setState((prev) => {
      const newState: OnboardingState = {
        ...prev,
        isLoggedIn: true,
        user: prev.user
          ? { ...prev.user, ...userData, name: userData.name || prev.user.name }
          : ({
              name: userData.name || 'Traveler',
              email: userData.email,
              phone: userData.phone,
              avatar: userData.avatar,
              id: userData.id,
            } as User),
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

  const logout = async () => {
    await userAuthService.logout();
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
        setAuthenticatedUser,
        completeProfile,
        completePreferences,
        completeWelcome,
        logout,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
