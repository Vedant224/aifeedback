import express from 'express';
import { body } from 'express-validator';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requestLogger } from '../middleware/logger.js';

const router = express.Router();

// Apply request logging middleware
router.use(requestLogger);

// Register user
router.post(
  '/register',
  authLimiter,
  validate([
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ]),
  registerUser
);

// Login user
router.post(
  '/login',
  authLimiter,
  validate([
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]),
  loginUser
);

// Get user profile
router.get('/profile', authenticate, getUserProfile);

// Update user profile
router.put(
  '/profile',
  authenticate,
  validate([
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail().withMessage('Please provide a valid email')
  ]),
  updateUserProfile
);

export default router;