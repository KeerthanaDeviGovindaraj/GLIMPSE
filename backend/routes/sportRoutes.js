import express from 'express';
import {
  getAllSports,
  createSport,
  deleteSport,
} from '../controllers/sportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
const express = require('express');
const sportController = require('../controllers/sportController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/').get(getAllSports).post(protect, authorize('admin'), createSport);

router.route('/:id').delete(protect, authorize('admin'), deleteSport);

router.get('/cricket/live', authMiddleware, sportController.getLiveCricketScores);
router.get('/football/today', authMiddleware, sportController.getTodayFootballScores);
export default router;