import express from 'express';
import {
  getLiveCricketMatches,
  getLiveFootballMatches
} from '../controllers/sportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cricket/live', protect, getLiveCricketMatches);
router.get('/football/live', protect, getLiveFootballMatches);

export default router;