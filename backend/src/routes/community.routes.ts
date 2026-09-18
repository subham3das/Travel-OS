import { Router } from 'express';
import { communityController } from '../controllers/community.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public feed
router.get('/posts', communityController.getPosts);
router.post('/posts/:id/like', communityController.likePost);

// Authenticated actions
router.post('/posts', authenticate, communityController.createPost);

export default router;
