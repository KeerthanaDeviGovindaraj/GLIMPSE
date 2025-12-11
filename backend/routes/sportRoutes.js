import express from 'express';
import {
  getLiveCricketMatches,
  getLiveFootballMatches,
  deleteSport
} from '../controllers/sportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cricket/live', protect, getLiveCricketMatches);
router.get('/football/live', protect, getLiveFootballMatches);

router.route('/:id').delete(protect, authorize('admin'), deleteSport);
export default router;