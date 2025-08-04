import express from 'express';
import { body } from 'express-validator';
import { processAiQuery } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { requestLogger } from '../middleware/logger.js';

const router = express.Router();

// Apply request logging middleware
router.use(requestLogger);

// Apply authentication and rate limiting
router.use(authenticate);
router.use(aiLimiter);

// Process AI query
router.post(
  '/query',
  validate([
    body('prompt')
      .notEmpty().withMessage('Prompt is required')
      .isString().withMessage('Prompt must be a string')
      .isLength({ max: 500 }).withMessage('Prompt cannot exceed 500 characters')
  ]),
  processAiQuery
);

export default router;