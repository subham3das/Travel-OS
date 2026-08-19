import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class OnboardingService {
  /**
   * Calculate dynamic onboarding status for customer
   */
  public async getOnboardingStatus(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const steps = [
      { key: 'email_verification', name: 'Email Verification', isCompleted: user.isEmailVerified },
      { key: 'profile_setup', name: 'Profile Setup', isCompleted: user.profileCompleted },
      { key: 'travel_preferences', name: 'Travel Preferences', isCompleted: user.preferenceCompleted },
      { key: 'notification_preferences', name: 'Notification Preferences', isCompleted: user.notificationsCompleted },
      { key: 'privacy_settings', name: 'Privacy Settings', isCompleted: user.privacyCompleted },
    ];

    const completedSteps = steps.filter((s) => s.isCompleted).map((s) => s.key);
    const remainingSteps = steps.filter((s) => !s.isCompleted).map((s) => s.key);

    const totalStepsCount = steps.length;
    const completedCount = completedSteps.length;
    const overallPercentage = Math.round((completedCount / totalStepsCount) * 100);

    // Determine current actionable step
    let currentStep = 'dashboard';
    if (!user.isEmailVerified) {
      currentStep = 'email_verification';
    } else if (!user.profileCompleted) {
      currentStep = 'profile_setup';
    } else if (!user.preferenceCompleted) {
      currentStep = 'travel_preferences';
    } else if (!user.notificationsCompleted) {
      currentStep = 'notification_preferences';
    } else if (!user.privacyCompleted) {
      currentStep = 'privacy_settings';
    } else if (!user.onboardingCompleted) {
      currentStep = 'welcome';
    }

    return {
      currentStep,
      completedSteps,
      remainingSteps,
      profileComplete: user.profileCompleted,
      preferencesComplete: user.preferenceCompleted,
      notificationsComplete: user.notificationsCompleted,
      privacyComplete: user.privacyCompleted,
      onboardingComplete: user.onboardingCompleted,
      overallPercentage,
    };
  }

  /**
   * Finalize Customer Onboarding & Return Welcome Screen Data
   */
  public async completeOnboarding(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateById(userId, {
      profileCompleted: true,
      preferenceCompleted: true,
      notificationsCompleted: true,
      privacyCompleted: true,
      onboardingCompleted: true,
      onboardingCompletedAt: new Date(),
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to complete onboarding');
    }

    logger.info('🎉 Customer onboarding completed: %s', updatedUser.email);

    return {
      name: updatedUser.fullName,
      profilePhoto: updatedUser.avatar || updatedUser.profileImage || '',
      homeCity: updatedUser.homeCity || 'Travel Explorer',
      completionStatus: '100%',
      memberSince: updatedUser.createdAt,
      welcomeMessage: `Welcome to Travel OS, ${updatedUser.fullName}! Your personalized travel profile is ready.`,
      nextStep: '/home',
    };
  }
}

export const onboardingService = new OnboardingService();
