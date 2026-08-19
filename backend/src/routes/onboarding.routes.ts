import { Router } from 'express';
import { onboardingController } from '../controllers/onboarding.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /onboarding/status:
 *   get:
 *     summary: Dynamic Customer Onboarding Progress & Current Step
 *     tags: [Onboarding]
 *     security:
 *       - BearerAuth: []
 */
router.get('/status', authenticate, onboardingController.getStatus);

/**
 * @openapi
 * /onboarding/complete:
 *   post:
 *     summary: Finalize Customer Onboarding
 *     tags: [Onboarding]
 *     security:
 *       - BearerAuth: []
 */
router.post('/complete', authenticate, onboardingController.complete);

export default router;
