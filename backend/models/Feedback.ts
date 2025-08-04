import mongoose, { Schema } from 'mongoose';

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

export interface FeedbackDocument extends mongoose.Document {
  title: string;
  description: string;
  status: FeedbackStatus;
  category: FeedbackCategory;
  userId: mongoose.Types.ObjectId;
  upvotes: number;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: Object.values(FeedbackStatus),
      default: FeedbackStatus.OPEN,
    },
    category: {
      type: String,
      enum: Object.values(FeedbackCategory),
      required: [true, 'Category is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    aiSummary: {
      type: String,
    },
  },
  { timestamps: true }
);

FeedbackSchema.index({ userId: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);