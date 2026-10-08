import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: get reviews
router.get('/', reviewController.getReviews);

// Authenticated: submit generic review
router.post('/', authenticate, (req, res, next) => reviewController.submitReview(req, res).catch(next));

// Authenticated: submit package review with verified booking check
router.post('/package', authenticate, (req, res, next) => reviewController.submitPackageReview(req, res).catch(next));

export default router;
