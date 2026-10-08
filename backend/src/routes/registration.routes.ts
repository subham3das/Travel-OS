import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller.js';

const router = Router();

/**
 * @route   POST /api/registration/draft
 * @desc    Save or create ongoing registration draft in MongoDB
 * @access  Public
 */
router.post('/draft', registrationController.saveDraft);

/**
 * @route   PATCH /api/registration/draft
 * @desc    Update ongoing registration draft in MongoDB
 * @access  Public
 */
router.patch('/draft', registrationController.saveDraft);

/**
 * @route   GET /api/registration/draft
 * @desc    Retrieve active registration draft by draftId or email
 * @access  Public
 */
router.get('/draft', registrationController.getDraft);

/**
 * @route   POST /api/registration/submit
 * @desc    Execute post-payment registration submission into MongoDB approval queue
 * @access  Public
 */
router.post('/submit', registrationController.submit);

export default router;
