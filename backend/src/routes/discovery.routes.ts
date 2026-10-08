import { Router } from 'express';
import { discoveryController } from '../controllers/discovery.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Storefront dynamic discovery feeds
router.get('/explore', optionalAuthenticate, discoveryController.getExploreFeed);
router.get('/homepage', optionalAuthenticate, discoveryController.getHomepageFeed);
router.get('/sections', discoveryController.getSections);

// Granular discovery feeds
router.get('/trending', discoveryController.getTrending);
router.get('/popular', discoveryController.getPopular);
router.get('/recommended', optionalAuthenticate, discoveryController.getRecommended);
router.get('/agencies', discoveryController.getAgencies);
router.get('/destinations', discoveryController.getDestinations);
router.get('/car-rentals', discoveryController.getCarRentals);

// Impression & click analytics
router.post('/track', optionalAuthenticate, discoveryController.trackAnalytics);

export default router;
