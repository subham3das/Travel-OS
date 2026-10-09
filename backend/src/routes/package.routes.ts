import { Router } from 'express';
import { packageController } from '../controllers/package.controller.js';
import { agencyPackageController } from '../controllers/agencyPackage.controller.js';
import { authenticateAgency, requireApprovedAgency } from '../middlewares/agencyAuth.middleware.js';

const router = Router();

// Package creation endpoint for agencies
router.post('/', authenticateAgency, requireApprovedAgency, (req, res, next) => {
  agencyPackageController.createPackage(req, res, next);
});
router.post('/:id/publish', authenticateAgency, requireApprovedAgency, (req, res, next) => {
  agencyPackageController.publishPackage(req, res, next);
});

// Public marketplace package endpoints
router.get('/', (req, res, next) => packageController.getPackages(req, res).catch(next));
router.get('/featured', (req, res, next) => packageController.getFeaturedPackages(req, res).catch(next));
router.get('/trending', (req, res, next) => packageController.getTrendingPackages(req, res).catch(next));
router.get('/:id', (req, res, next) => packageController.getPackageById(req, res).catch(next));
router.get('/:id/reviews', (req, res, next) => packageController.getPackageReviews(req, res).catch(next));
router.get('/:id/rating', (req, res, next) => packageController.getPackageRating(req, res).catch(next));
router.get('/:id/similar', (req, res, next) => packageController.getSimilarPackages(req, res).catch(next));

export default router;
