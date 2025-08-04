import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler.js';

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new AppError('JWT_SECRET is not defined in environment variables', 500);
  }
  
  return jwt.sign(
    { id }, 
    secret, 
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new AppError('JWT_SECRET is not defined in environment variables', 500);
  }
  
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    } else {
      throw new AppError('Token verification failed', 401);
    }
  }
};