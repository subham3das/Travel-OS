import { Router } from 'express';
import { travelerController } from '../controllers/traveler.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  SavedTravelerSchema,
  UpdateSavedTravelerSchema,
} from '../validations/traveler.validation.js';

const router = Router();

/**
 * @openapi
 * /travelers:
 *   get:
 *     summary: List Saved Travelers for Booking
 *     tags: [Saved Travelers]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', authenticate, travelerController.list);

/**
 * @openapi
 * /travelers:
 *   post:
 *     summary: Add a New Saved Traveler
 *     tags: [Saved Travelers]
 *     security:
 *       - BearerAuth: []
 */
router.post(
  '/',
  authenticate,
  validateRequest({ body: SavedTravelerSchema }),
  travelerController.add
);

/**
 * @openapi
 * /travelers/{id}:
 *   patch:
 *     summary: Update Saved Traveler
 *     tags: [Saved Travelers]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  '/:id',
  authenticate,
  validateRequest({ body: UpdateSavedTravelerSchema }),
  travelerController.update
);

/**
 * @openapi
 * /travelers/{id}:
 *   delete:
 *     summary: Remove Saved Traveler
 *     tags: [Saved Travelers]
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', authenticate, travelerController.delete);

export default router;
