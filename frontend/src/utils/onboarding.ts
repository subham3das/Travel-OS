export interface User {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}

export interface OnboardingState {
  isLoggedIn: boolean;
  hasCompletedProfile: boolean;
  hasCompletedPreferences: boolean;
  hasSeenWelcome: boolean;
  hasCompletedOnboarding: boolean;
  user: User | null;
}

const KEYS = {
  USER: 'apnatrip_user',
  LOGGED_IN: 'apnatrip_is_logged_in',
  PROFILE_COMPLETED: 'apnatrip_has_completed_profile',
  PREFERENCES_COMPLETED: 'apnatrip_has_completed_preferences',
  WELCOME_SEEN: 'apnatrip_has_seen_welcome',
  ONBOARDING_COMPLETED: 'apnatrip_has_completed_onboarding',
};

export const getOnboardingStateFromStorage = (): OnboardingState => {
  try {
    const userJson = localStorage.getItem(KEYS.USER);
    const user = userJson ? JSON.parse(userJson) : null;

    const isLoggedIn = localStorage.getItem(KEYS.LOGGED_IN) === 'true' || !!user;
    const hasCompletedProfile = localStorage.getItem(KEYS.PROFILE_COMPLETED) === 'true';
    const hasCompletedPreferences = localStorage.getItem(KEYS.PREFERENCES_COMPLETED) === 'true';
    const hasSeenWelcome = localStorage.getItem(KEYS.WELCOME_SEEN) === 'true';
    const hasCompletedOnboarding = localStorage.getItem(KEYS.ONBOARDING_COMPLETED) === 'true';

    return {
      isLoggedIn,
      hasCompletedProfile,
      hasCompletedPreferences,
      hasSeenWelcome,
      hasCompletedOnboarding,
      user,
    };
  } catch (error) {
    console.error('Error reading onboarding state from storage:', error);
    return {
      isLoggedIn: false,
      hasCompletedProfile: false,
      hasCompletedPreferences: false,
      hasSeenWelcome: false,
      hasCompletedOnboarding: false,
      user: null,
    };
  }
};

export const saveOnboardingStateToStorage = (state: Partial<OnboardingState>) => {
  try {
    if (state.user !== undefined) {
      if (state.user) {
        localStorage.setItem(KEYS.USER, JSON.stringify(state.user));
      } else {
        localStorage.removeItem(KEYS.USER);
      }
    }
    if (state.isLoggedIn !== undefined) {
      localStorage.setItem(KEYS.LOGGED_IN, String(state.isLoggedIn));
    }
    if (state.hasCompletedProfile !== undefined) {
      localStorage.setItem(KEYS.PROFILE_COMPLETED, String(state.hasCompletedProfile));
    }
    if (state.hasCompletedPreferences !== undefined) {
      localStorage.setItem(KEYS.PREFERENCES_COMPLETED, String(state.hasCompletedPreferences));
    }
    if (state.hasSeenWelcome !== undefined) {
      localStorage.setItem(KEYS.WELCOME_SEEN, String(state.hasSeenWelcome));
    }
    if (state.hasCompletedOnboarding !== undefined) {
      localStorage.setItem(KEYS.ONBOARDING_COMPLETED, String(state.hasCompletedOnboarding));
    }
  } catch (error) {
    console.error('Error saving onboarding state to storage:', error);
  }
};

export const clearOnboardingStorage = () => {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
};
