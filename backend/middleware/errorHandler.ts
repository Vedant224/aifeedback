import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log detailed error information
  const errorDetails = {
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    isOperational: err.isOperational,
  };
  
  // Log error with appropriate level based on status code
  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error('Server error:', errorDetails);
  } else if (err.statusCode >= 400) {
    logger.warn('Client error:', errorDetails);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(messages.join(', '), 400);
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }
  
  // Respond with appropriate error message
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};