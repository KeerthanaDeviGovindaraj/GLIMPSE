import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin', 'analyst']).withMessage('Invalid role'),
  ],
  signup
);

router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
], login);

export default router;

