// backend/routes/commentaryRoutes.js
const express = require('express');
const router = express.Router();
const commentaryController = require('../controllers/commentaryController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/commentary/generate:
 *   post:
 *     summary: Generate AI commentary for a match
 *     tags: [Commentary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *             properties:
 *               matchId:
 *                 type: string
 *               customPrompt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commentary generated successfully
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.post('/generate', protect, commentaryController.generateCommentary);

/**
 * @swagger
 * /api/commentary/match/{matchId}:
 *   get:
 *     summary: Get commentary for a specific match
 *     tags: [Commentary]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commentary retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/match/:matchId', commentaryController.getMatchCommentary);

/**
 * @swagger
 * /api/commentary/{id}:
 *   delete:
 *     summary: Delete a commentary
 *     tags: [Commentary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commentary deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Commentary not found
 */
router.delete('/:id', protect, commentaryController.deleteCommentary);

module.exports = router;