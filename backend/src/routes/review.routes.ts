import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: get reviews
router.get('/', reviewController.getReviews);

// Authenticated: submit review
router.post('/', authenticate, reviewController.submitReview);

export default router;
