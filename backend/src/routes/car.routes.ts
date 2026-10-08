import { Router } from 'express';
import { carController } from '../controllers/car.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public vehicle catalog & discovery routes
router.get('/', (req, res, next) => carController.listCars(req, res).catch(next));
router.get('/category-counts', (req, res, next) => carController.getCategoryCounts(req, res).catch(next));
router.get('/rentals/search', (req, res, next) => carController.searchRentals(req, res).catch(next));
router.get('/rentals/estimate', (req, res, next) => carController.getRentalPriceEstimate(req, res).catch(next));
router.get('/favorites/my', authenticate, (req, res, next) => carController.getFavorites(req, res).catch(next));
router.get('/:id', (req, res, next) => carController.getCarById(req, res).catch(next));
router.get('/:id/reviews', (req, res, next) => carController.getCarReviews(req, res).catch(next));

// Authenticated user interactions
router.post('/:id/favorite', authenticate, (req, res, next) => carController.toggleFavorite(req, res).catch(next));
router.post('/:id/report', authenticate, (req, res, next) => carController.reportCar(req, res).catch(next));

export default router;
