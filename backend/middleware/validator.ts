import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err: ValidationError) => {
      if ('path' in err) {
        return { [err.path]: err.msg };
      }
      if ('param' in err) {
        return { [(err as any).param]: err.msg };
      }
      return { error: 'Invalid value' };
    });

    const firstError = errors.array()[0];
    const errorMessage = firstError.msg || 'Validation error';
    
    logger.warn(`Validation error: ${errorMessage}`, { 
      path: req.path, 
      method: req.method, 
      errors: extractedErrors 
    });

    next(new AppError(errorMessage, 400));
  };
};