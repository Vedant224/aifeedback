import { body, param, ValidationChain } from 'express-validator';
import { FeedbackCategory, FeedbackStatus } from '../models/Feedback.js';

// User validation chains
export const userValidation = {
  register: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  login: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  updateProfile: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail().withMessage('Please provide a valid email')
  ]
};

// Feedback validation chains
export const feedbackValidation = {
  create: [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(Object.values(FeedbackCategory)).withMessage('Invalid category')
  ],
  update: [
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
  ],
  getById: [
    param('id').isMongoId().withMessage('Invalid feedback ID')
  ],
  delete: [
    param('id').isMongoId().withMessage('Invalid feedback ID')
  ],
  upvote: [
    param('id').isMongoId().withMessage('Invalid feedback ID')
  ]
};

// AI validation chains
export const aiValidation = {
  query: [
    body('prompt')
      .notEmpty().withMessage('Prompt is required')
      .isString().withMessage('Prompt must be a string')
      .isLength({ max: 500 }).withMessage('Prompt cannot exceed 500 characters')
  ]
};

// MongoDB ID validator
export const validateMongoId = (paramName: string = 'id'): ValidationChain => {
  return param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`);
};