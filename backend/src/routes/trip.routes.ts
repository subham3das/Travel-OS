import { Router } from 'express';
import { tripController } from '../controllers/trip.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// All customer trip endpoints require user authentication
router.use(authenticate);

router.get('/my', tripController.getMyTrips);
router.get('/stats', tripController.getTravelStats);
router.get('/:id', tripController.getTripById);
router.get('/:id/documents', tripController.getTripDocuments);

export default router;
