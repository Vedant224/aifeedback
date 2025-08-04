import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

interface JwtPayload {
  id: string;
  email: string;
}

declare  global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      throw new AppError('Authentication required', 401);
    }
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Authentication error: Invalid token');
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Authentication error: Token expired');
      next(new AppError('Token expired', 401));
    } else {
      logger.error('Authentication error:', error);
      next(error);
    }
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn(`Access denied: User ${req.user?._id} attempted to access admin route`);
    next(new AppError('Admin access required', 403));
  }
};