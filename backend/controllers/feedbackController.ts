import { Request, Response, NextFunction } from 'express';
import { FeedbackStatus, FeedbackCategory } from '../models/Feedback.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import feedbackService from '../services/feedbackService.js';
import logger from '../utils/logger.js';

export const getAllFeedback = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as FeedbackStatus | undefined;
  const category = req.query.category as FeedbackCategory | undefined;
  
  logger.info(`Fetching feedback with filters: status=${status}, category=${category}, page=${page}, limit=${limit}`);
  
  const { feedback, pagination } = await feedbackService.getAllFeedback(
    page,
    limit,
    status,
    category
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      feedback,
      pagination,
    },
  });
});

export const createFeedback = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const { title, description, category } = req.body;
  const userId = req.user.id;
  
  logger.info(`Creating new feedback by user: ${userId}`);
  
  const feedback = await feedbackService.createFeedback(
    title,
    description,
    category,
    userId
  );
  
  logger.info(`Feedback created successfully: ${feedback._id}`);
  
  res.status(201).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});

export const getFeedbackById = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const feedbackId = req.params.id;
  
  logger.info(`Fetching feedback by ID: ${feedbackId}`);
  
  const feedback = await feedbackService.getFeedbackById(feedbackId);
  
  res.status(200).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});

export const updateFeedback = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const { title, description, status, category } = req.body;
  const feedbackId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  logger.info(`Updating feedback: ${feedbackId} by user: ${userId}`);
  
  const feedback = await feedbackService.updateFeedback(
    feedbackId,
    { title, description, status, category },
    userId,
    userRole
  );
  
  logger.info(`Feedback updated successfully: ${feedbackId}`);
  
  res.status(200).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});

export const deleteFeedback = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const feedbackId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  logger.info(`Deleting feedback: ${feedbackId} by user: ${userId}`);
  
  await feedbackService.deleteFeedback(feedbackId, userId, userRole);
  
  logger.info(`Feedback deleted successfully: ${feedbackId}`);
  
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

export const upvoteFeedback = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const feedbackId = req.params.id;
  
  logger.info(`Upvoting feedback: ${feedbackId}`);
  
  const feedback = await feedbackService.upvoteFeedback(feedbackId);
  
  logger.info(`Feedback upvoted successfully: ${feedbackId}`);
  
  res.status(200).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});