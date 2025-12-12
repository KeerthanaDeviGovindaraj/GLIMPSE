const express = require('express');
const router = express.Router();
const { upload, multerErrorHandler } = require('../middleware/multerConfig');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  uploadFile,
  getUploadHistory,
  deleteUpload,
  previewUpload,
  processUploadedData,
} = require('../controllers/uploadController');

/**
 * @swagger
 * /api/upload/data:
 *   post:
 *     summary: Upload CSV or Excel file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post('/data', auth, roleCheck('Admin', 'Analyst'), upload.single('file'), uploadFile, multerErrorHandler);

/**
 * @swagger
 * /api/upload/history:
 *   get:
 *     summary: Get upload history
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upload history retrieved
 */
router.get('/history', auth, getUploadHistory);

/**
 * @swagger
 * /api/upload/{id}:
 *   delete:
 *     summary: Delete upload
 *     tags: [Upload]
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
 *         description: Upload deleted
 */
router.delete('/:id', auth, deleteUpload);

/**
 * @swagger
 * /api/upload/preview/{id}:
 *   get:
 *     summary: Preview upload data
 *     tags: [Upload]
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
 *         description: Preview retrieved
 */
router.get('/preview/:id', auth, previewUpload);

/**
 * @swagger
 * /api/upload/process:
 *   post:
 *     summary: Process uploaded data
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uploadId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data processed
 */
router.post('/process', auth, roleCheck('Admin', 'Analyst'), processUploadedData);

module.exports = router;