const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  getDashboardStats,
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
} = require('../controllers/adminController');

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 */
router.get('/dashboard', auth, roleCheck('Admin'), getDashboardStats);

/**
 * @swagger
 * /api/admin/sports:
 *   get:
 *     summary: Get all sports
 *     tags: [Sports Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sports retrieved
 */
router.get('/sports', auth, roleCheck('Admin', 'Analyst'), getAllSports);

/**
 * @swagger
 * /api/admin/sports/{id}:
 *   get:
 *     summary: Get sport by ID
 *     tags: [Sports Management]
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
 *         description: Sport retrieved
 */
router.get('/sports/:id', auth, getSportById);

/**
 * @swagger
 * /api/admin/sports:
 *   post:
 *     summary: Create sport
 *     tags: [Sports Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sport created
 */
router.post('/sports', auth, roleCheck('Admin'), createSport);

/**
 * @swagger
 * /api/admin/sports/{id}:
 *   put:
 *     summary: Update sport
 *     tags: [Sports Management]
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
 *         description: Sport updated
 */
router.put('/sports/:id', auth, roleCheck('Admin'), updateSport);

/**
 * @swagger
 * /api/admin/sports/{id}:
 *   delete:
 *     summary: Delete sport
 *     tags: [Sports Management]
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
 *         description: Sport deleted
 */
router.delete('/sports/:id', auth, roleCheck('Admin'), deleteSport);

module.exports = router;