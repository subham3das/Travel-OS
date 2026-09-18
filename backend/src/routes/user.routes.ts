import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { UpdateProfileSchema } from '../validations/profile.validation.js';

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get Authenticated User Profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.get('/profile', authenticate, profileController.getProfile);

/**
 * @openapi
 * /users/profile:
 *   patch:
 *     summary: Update Authenticated User Profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/profile',
  authenticate,
  validateRequest({ body: UpdateProfileSchema }),
  profileController.updateProfile
);

export default router;
