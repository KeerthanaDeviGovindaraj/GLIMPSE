// backend/routes/commentaryRoutes.js - ES Module Version
import express from 'express';
import { 
  getAllCommentaries, 
  createCommentary, 
  getCommentariesBySport, 
  deleteCommentary 
} from '../controllers/commentaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/commentaries:
 *   get:
 *     summary: Get all commentaries
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of commentaries
 */
router.get('/', authMiddleware, getAllCommentaries);

/**
 * @swagger
 * /api/commentaries:
 *   post:
 *     summary: Create new commentary
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *               sport:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commentary created
 */
router.post('/', authMiddleware, createCommentary);

/**
 * @swagger
 * /api/commentaries/sport/{sport}:
 *   get:
 *     summary: Get commentaries by sport
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sport/:sport', authMiddleware, getCommentariesBySport);

/**
 * @swagger
 * /api/commentaries/{id}:
 *   delete:
 *     summary: Delete commentary
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, deleteCommentary);

export default router;