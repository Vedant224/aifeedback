import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('Too many requests, please try again later.', 429));
  }
});

// More strict limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 auth attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('Too many login attempts, please try again later.', 429));
  }
});

// Specific limiter for AI queries
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI queries per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`AI query rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('AI query limit reached, please try again later.', 429));
  }
});