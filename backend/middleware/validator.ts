import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

// Middleware to check validation results
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extract error messages with proper type handling
    const extractedErrors = errors.array().map((err: ValidationError) => {
      // Use type assertion or handle different error structures
      if ('path' in err) {
        return { [err.path]: err.msg };
      }
      if ('param' in err) {
        // For backward compatibility with older express-validator
        return { [(err as any).param]: err.msg };
      }
      return { error: 'Invalid value' };
    });

    // Create error message from first error
    const firstError = errors.array()[0];
    const errorMessage = firstError.msg || 'Validation error';
    
    // Log validation errors
    logger.warn(`Validation error: ${errorMessage}`, { 
      path: req.path, 
      method: req.method, 
      errors: extractedErrors 
    });

    next(new AppError(errorMessage, 400));
  };
};