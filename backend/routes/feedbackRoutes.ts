import express from 'express';
import { body, param } from 'express-validator';
import { 
  getAllFeedback, 
  createFeedback, 
  getFeedbackById, 
  updateFeedback, 
  deleteFeedback,
  upvoteFeedback
} from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { FeedbackCategory, FeedbackStatus } from '../models/Feedback.js';
import { requestLogger } from '../middleware/logger.js';

const router = express.Router();

// Apply request logging middleware
router.use(requestLogger);

// Protect all routes
router.use(authenticate);

// Get all feedback and create new feedback
router.route('/')
  .get(getAllFeedback)
  .post(
    validate([
      body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
      body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
      body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(Object.values(FeedbackCategory)).withMessage('Invalid category')
    ]),
    createFeedback
  );

// Get, update, and delete feedback by ID
router.route('/:id')
  .get(
    validate([
      param('id').isMongoId().withMessage('Invalid feedback ID')
    ]),
    getFeedbackById
  )
  .put(
    validate([
      param('id').isMongoId().withMessage('Invalid feedback ID'),
      body('title')
        .optional()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
      body('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
      body('status')
        .optional()
        .isIn(Object.values(FeedbackStatus)).withMessage('Invalid status'),
      body('category')
        .optional()
        .isIn(Object.values(FeedbackCategory)).withMessage('Invalid category')
    ]),
    updateFeedback
  )
  .delete(
    validate([
      param('id').isMongoId().withMessage('Invalid feedback ID')
    ]),
    deleteFeedback
  );

// Upvote feedback
router.patch(
  '/:id/upvote',
  validate([
    param('id').isMongoId().withMessage('Invalid feedback ID')
  ]),
  upvoteFeedback
);

export default router;