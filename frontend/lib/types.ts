export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Feedback {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: 'bug' | 'feature' | 'improvement';
  userId: User | string;
  upvotes: number;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackFilters {
  status?: string;
  category?: string;
}