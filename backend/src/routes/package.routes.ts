import { Router } from 'express';
import { packageController } from '../controllers/package.controller.js';

const router = Router();

// Public marketplace package endpoints
router.get('/', (req, res, next) => packageController.getPackages(req, res).catch(next));
router.get('/featured', (req, res, next) => packageController.getFeaturedPackages(req, res).catch(next));
router.get('/trending', (req, res, next) => packageController.getTrendingPackages(req, res).catch(next));
router.get('/:id', (req, res, next) => packageController.getPackageById(req, res).catch(next));
router.get('/:id/similar', (req, res, next) => packageController.getSimilarPackages(req, res).catch(next));

export default router;
