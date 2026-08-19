import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import {
  UpdateProfileSchema,
  CheckUsernameParamsSchema,
} from '../validations/profile.validation.js';
import {
  TravelPreferencesSchema,
  NotificationPreferencesSchema,
  PrivacyPreferencesSchema,
} from '../validations/preferences.validation.js';

const router = Router();

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get Full Customer Profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', authenticate, profileController.getProfile);

/**
 * @openapi
 * /profile:
 *   patch:
 *     summary: Update Personal Profile Details
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/',
  authenticate,
  validateRequest({ body: UpdateProfileSchema }),
  profileController.updateProfile
);

/**
 * @openapi
 * /profile/photo:
 *   post:
 *     summary: Upload Customer Avatar via Cloudinary
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 */
router.post(
  '/photo',
  authenticate,
  uploadMiddleware.single('photo'),
  profileController.uploadPhoto
);

/**
 * @openapi
 * /profile/check-username/{username}:
 *   get:
 *     summary: Check Username Availability
 *     tags: [Profile]
 */
router.get(
  '/check-username/:username',
  validateRequest({ params: CheckUsernameParamsSchema }),
  profileController.checkUsername
);

/**
 * @openapi
 * /profile/travel-preferences:
 *   patch:
 *     summary: Update Travel Preferences
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/travel-preferences',
  authenticate,
  validateRequest({ body: TravelPreferencesSchema }),
  profileController.updateTravelPreferences
);

/**
 * @openapi
 * /profile/notification-preferences:
 *   patch:
 *     summary: Update Notification Preferences
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/notification-preferences',
  authenticate,
  validateRequest({ body: NotificationPreferencesSchema }),
  profileController.updateNotificationPreferences
);

/**
 * @openapi
 * /profile/privacy-preferences:
 *   patch:
 *     summary: Update Privacy Settings
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/privacy-preferences',
  authenticate,
  validateRequest({ body: PrivacyPreferencesSchema }),
  profileController.updatePrivacyPreferences
);

export default router;
