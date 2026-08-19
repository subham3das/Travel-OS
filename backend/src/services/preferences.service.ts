import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError } from '../utils/errors.util.js';
import { ITravelPreferences, INotificationPreferences, IPrivacySettings } from '../models/user.model.js';
import { logger } from '../config/logger.config.js';

export class PreferencesService {
  /**
   * Update Travel Preferences
   */
  public async updateTravelPreferences(userId: string, prefs: ITravelPreferences) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateById(userId, {
      travelPreferences: {
        ...user.travelPreferences,
        ...prefs,
      },
      preferenceCompleted: true,
      preferenceCompletedAt: new Date(),
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to update travel preferences');
    }

    logger.info('✈️ Travel preferences configured for: %s', updatedUser.email);
    return {
      travelPreferences: updatedUser.travelPreferences,
      preferenceCompleted: updatedUser.preferenceCompleted,
      message: 'Travel preferences saved successfully',
    };
  }

  /**
   * Update Notification Preferences
   */
  public async updateNotificationPreferences(
    userId: string,
    notificationPrefs: Partial<INotificationPreferences>
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateById(userId, {
      notificationPreferences: {
        ...user.notificationPreferences,
        ...notificationPrefs,
      },
      notificationsCompleted: true,
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to update notification preferences');
    }

    logger.info('🔔 Notification preferences updated for: %s', updatedUser.email);
    return {
      notificationPreferences: updatedUser.notificationPreferences,
      notificationsCompleted: updatedUser.notificationsCompleted,
      message: 'Notification preferences saved successfully',
    };
  }

  /**
   * Update Privacy Preferences
   */
  public async updatePrivacyPreferences(userId: string, privacyPrefs: Partial<IPrivacySettings>) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateById(userId, {
      privacySettings: {
        ...user.privacySettings,
        ...privacyPrefs,
      },
      privacyCompleted: true,
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to update privacy preferences');
    }

    logger.info('🛡️ Privacy preferences updated for: %s', updatedUser.email);
    return {
      privacySettings: updatedUser.privacySettings,
      privacyCompleted: updatedUser.privacyCompleted,
      message: 'Privacy settings saved successfully',
    };
  }
}

export const preferencesService = new PreferencesService();
