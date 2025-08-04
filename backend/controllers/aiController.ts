import { Request, Response, NextFunction } from 'express';
import aiService from '../services/aiService.js';
import { AppError } from '../middleware/errorHandler.js'; // This is used now
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const processAiQuery = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { prompt } = req.body;
  const userId = req.user.id;
  
  if (!prompt || typeof prompt !== 'string') {
    throw new AppError('Valid prompt is required', 400);
  }
  
  if (prompt.length > 500) {
    throw new AppError('Prompt cannot exceed 500 characters', 400);
  }
  
  logger.info(`Processing AI query from user: ${userId}`);
  
  try {
    const answer = await aiService.generateAiResponse(prompt);
    
    logger.info(`AI response generated successfully for user: ${userId}`);
    
    res.status(200).json({
      status: 'success',
      data: {
        answer,
        prompt
      }
    });
  } catch (error) {
    logger.error(`Error processing AI request for user: ${userId}`, error);
    throw new AppError('Error processing AI request: ' + (error instanceof Error ? error.message : 'Unknown error'), 500); // Using AppError here
  }
});