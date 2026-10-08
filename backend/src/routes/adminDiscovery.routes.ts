import { Router } from 'express';
import { adminDiscoveryController } from '../controllers/adminDiscovery.controller.js';
import { authenticateAdmin, optionalAdminAuth } from '../middlewares/adminAuth.middleware.js';

const router = Router();

// Overrides
router.get('/overrides', optionalAdminAuth, adminDiscoveryController.getOverrides);
router.post('/override', authenticateAdmin, adminDiscoveryController.createOrUpdateOverride);
router.delete('/override/:id', authenticateAdmin, adminDiscoveryController.deleteOverride);

// Sections
router.get('/sections', optionalAdminAuth, adminDiscoveryController.getSections);
router.put('/sections/:sectionId', authenticateAdmin, adminDiscoveryController.updateSection);
router.patch('/sections/:sectionId/toggle', authenticateAdmin, adminDiscoveryController.toggleSection);
router.post('/sections/seed-default', authenticateAdmin, adminDiscoveryController.seedDefaultSections);

export default router;
