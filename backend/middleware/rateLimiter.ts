import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('Too many requests, please try again later.', 429));
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('Too many login attempts, please try again later.', 429));
  }
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`AI query rate limit exceeded for IP: ${req.ip}`);
    next(new AppError('AI query limit reached, please try again later.', 429));
  }
});