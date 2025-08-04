import { Document } from 'mongoose';
import { User } from './user.js';

export enum FeedbackStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
}

export enum FeedbackCategory {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  category: FeedbackCategory;
  userId: string | User;
  upvotes: number;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackInput {
  title: string;
  description: string;
  category: FeedbackCategory;
}

export interface FeedbackUpdateInput {
  title?: string;
  description?: string;
  status?: FeedbackStatus;
  category?: FeedbackCategory;
}

export interface FeedbackDocument extends Document {
  title: string;
  description: string;
  status: FeedbackStatus;
  category: FeedbackCategory;
  userId: string | User;
  upvotes: number;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackFilters {
  status?: FeedbackStatus;
  category?: FeedbackCategory;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}