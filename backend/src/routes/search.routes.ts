import { Router } from 'express';
import { searchController } from '../controllers/search.controller.js';

const router = Router();

router.get('/', (req, res, next) => searchController.search(req, res).catch(next));

export default router;
