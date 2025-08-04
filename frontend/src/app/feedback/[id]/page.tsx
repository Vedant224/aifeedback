'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import StatusBadge from '@/../components/feedback/StatusBadge';
import LoadingSpinner from '@/../components/ui/LoadingSpinner';
import { fetchWithAuth } from '@/../lib/api';

// Define types for feedback
interface User {
  name?: string;
}

interface Feedback {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: string;
  upvotes: number;
  userId?: User;
  aiSummary?: string;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch feedback details
  useEffect(() => {
    const getFeedback = async () => {
      if (authStatus === 'authenticated') {
        try {
          setIsLoading(true);
          const data = await fetchWithAuth(`/feedback/${params.id}`);
          setFeedback(data.data.feedback);
        } catch (error) {
          console.error('Error fetching feedback:', error);
          toast.error('Failed to load feedback details');
          router.push('/feedback');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (params.id && authStatus === 'authenticated') {
      getFeedback();
    }
  }, [params.id, authStatus, router]);
  
  // Handle status update
  const updateStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      
      const data = await fetchWithAuth(`/feedback/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus
        }),
      });
      
      setFeedback(data.data.feedback);
      toast.success('Status updated successfully');
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle upvote
  const handleUpvote = async () => {
    try {
      const data = await fetchWithAuth(`/feedback/${params.id}/upvote`, {
        method: 'PATCH',
      });
      
      setFeedback(data.data.feedback);
      toast.success('Feedback upvoted');
      
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Failed to upvote feedback');
    }
  };
  
  // Redirect if not authenticated
  if (authStatus === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!feedback) {
    return <div>Feedback not found</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{feedback.title}</h1>
          <StatusBadge status={feedback.status} />
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Category: <span className="font-medium">{feedback.category}</span>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Submitted by: <span className="font-medium">{feedback.userId?.name || 'Anonymous'}</span>
          </div>
          
          <p className="text-gray-800 whitespace-pre-line">{feedback.description}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpvote}
              className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors"
            >
              👍 Upvote ({feedback.upvotes})
            </button>
            
            <div className="ml-auto">
              <select
                value={feedback.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={isUpdating}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
        
        {feedback.aiSummary && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">AI Summary</h3>
            <p className="text-blue-700 text-sm">{feedback.aiSummary}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => router.push('/feedback')}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Feedback List
        </button>
      </div>
    </div>
  );
}