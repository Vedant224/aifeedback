import React from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

// Define the user type
interface User {
  _id: string;
  name: string;
  email?: string;
}

// Define the feedback item structure
interface FeedbackItem {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: 'bug' | 'feature' | 'improvement';
  createdAt: string;
  upvotes: number;
  userId?: User | null;
}

// Define props for the FeedbackList component
interface FeedbackListProps {
  feedbackItems: FeedbackItem[];
  onFeedbackUpdated?: (updatedFeedback: FeedbackItem) => void;
}

// Define props for the FeedbackItem component
interface FeedbackItemProps {
  feedback: FeedbackItem;
  onFeedbackUpdated?: (updatedFeedback: FeedbackItem) => void;
}

export default function FeedbackList({ feedbackItems, onFeedbackUpdated }: FeedbackListProps) {
  if (!feedbackItems || feedbackItems.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">No feedback items found.</p>
        <Link
          href="/feedback/new"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit New Feedback
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {feedbackItems.map((item: FeedbackItem) => (
        <FeedbackItem 
          key={item._id} 
          feedback={item} 
          onFeedbackUpdated={onFeedbackUpdated} 
        />
      ))}
    </div>
  );
}

function FeedbackItem({ feedback,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFeedbackUpdated 
}: FeedbackItemProps) {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <Link href={`/feedback/${feedback._id}`}>
          <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors">
            {feedback.title}
          </h3>
        </Link>
        <StatusBadge status={feedback.status} />
      </div>
      
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <span>
          {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
        </span>
        <span className="mx-2">•</span>
        <span>
          {formatDate(feedback.createdAt)}
        </span>
        <span className="mx-2">•</span>
        <span>
          {feedback.userId?.name || 'Anonymous'}
        </span>
      </div>
      
      <p className="mt-2 text-gray-700 line-clamp-2">
        {feedback.description}
      </p>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <span className="flex items-center text-gray-600">
            👍 {feedback.upvotes}
          </span>
        </div>
        
        <Link
          href={`/feedback/${feedback._id}`}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}