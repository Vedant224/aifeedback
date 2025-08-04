import Feedback, { FeedbackStatus, FeedbackCategory, FeedbackDocument } from '../models/Feedback.js';
import { AppError } from '../middleware/errorHandler.js';
import aiService from './aiService.js';
import logger from '../utils/logger.js';

interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FeedbackServiceResult {
  feedback: FeedbackDocument[];
  pagination: PaginationResult;
}

interface FeedbackUpdateData {
  title?: string;
  description?: string;
  status?: FeedbackStatus;
  category?: FeedbackCategory;
}

/**
 * Get all feedback items with pagination and filtering
 */
async function getAllFeedback(
  page: number,
  limit: number,
  status?: FeedbackStatus,
  category?: FeedbackCategory
): Promise<FeedbackServiceResult> {
  // Build filter
  const filter: any = {};
  if (status) {filter.status = status;}
  if (category) {filter.category = category;}
  
  // Get count for pagination
  const total = await Feedback.countDocuments(filter);
  
  // Fetch feedback items with pagination
  const feedback = await Feedback.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'name email');
  
  return {
    feedback,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new feedback item
 */
async function createFeedback(
  title: string,
  description: string,
  category: FeedbackCategory,
  userId: string
): Promise<FeedbackDocument> {
  // Create feedback
  const feedback = await Feedback.create({
    title,
    description,
    category,
    userId,
  });
  
  // Generate AI summary
  try {
    const prompt = `Please create a brief summary (max 50 words) of this feedback: "${description}"`;
    const aiSummary = await aiService.generateAiResponse(prompt);
    
    // Update feedback with AI summary
    feedback.aiSummary = aiSummary;
    await feedback.save();
  } catch (error) {
    logger.error('Error generating AI summary:', error);
    // Continue without AI summary if it fails
  }
  
  return feedback;
}

/**
 * Get feedback by ID
 */
async function getFeedbackById(id: string): Promise<FeedbackDocument> {
  const feedback = await Feedback.findById(id)
    .populate('userId', 'name email');
  
  if (!feedback) {
    logger.warn(`Feedback not found: ${id}`);
    throw new AppError('Feedback not found', 404);
  }
  
  return feedback;
}

/**
 * Update feedback
 */
async function updateFeedback(
  id: string,
  updateData: FeedbackUpdateData,
  userId: string,
  userRole: string
): Promise<FeedbackDocument> {
  // Find feedback
  let feedback = await Feedback.findById(id);
  
  if (!feedback) {
    logger.warn(`Update failed: Feedback not found: ${id}`);
    throw new AppError('Feedback not found', 404);
  }
  
  // Check if user owns the feedback or is admin
  if (feedback.userId.toString() !== userId && userRole !== 'admin') {
    logger.warn(`Update failed: User ${userId} not authorized to update feedback ${id}`);
    throw new AppError('Not authorized to update this feedback', 403);
  }
  
  // Update feedback
  feedback = await Feedback.findByIdAndUpdate(
    id,
    { ...updateData },
    { new: true, runValidators: true }
  );
  
  if (!feedback) {
    logger.error(`Feedback update failed for ID: ${id}`);
    throw new AppError('Error updating feedback', 500);
  }
  
  return feedback;
}

/**
 * Delete feedback
 */
async function deleteFeedback(
  id: string,
  userId: string,
  userRole: string
): Promise<void> {
  // Find feedback
  const feedback = await Feedback.findById(id);
  
  if (!feedback) {
    logger.warn(`Delete failed: Feedback not found: ${id}`);
    throw new AppError('Feedback not found', 404);
  }
  
  // Check if user owns the feedback or is admin
  if (feedback.userId.toString() !== userId && userRole !== 'admin') {
    logger.warn(`Delete failed: User ${userId} not authorized to delete feedback ${id}`);
    throw new AppError('Not authorized to delete this feedback', 403);
  }
  
  // Delete feedback
  await feedback.deleteOne();
}

/**
 * Upvote feedback
 */
async function upvoteFeedback(id: string): Promise<FeedbackDocument> {
  // Find and update feedback
  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  
  if (!feedback) {
    logger.warn(`Upvote failed: Feedback not found: ${id}`);
    throw new AppError('Feedback not found', 404);
  }
  
  return feedback;
}

export default {
  getAllFeedback,
  createFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  upvoteFeedback,
};