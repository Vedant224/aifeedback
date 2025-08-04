import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request details
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  // Log response details when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, {
      statusCode: res.statusCode,
      duration,
    });
  });
  
  next();
};