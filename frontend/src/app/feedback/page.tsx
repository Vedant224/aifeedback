'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FeedbackList from '@/../components/feedback/FeedbackList';
import FeedbackFilter from '@/../components/feedback/FeedbackFilter';
import LoadingSpinner from '@/../components/ui/LoadingSpinner';
import { fetchWithAuth } from '@/../lib/api';

// Define interface for filter
interface FeedbackFilter {
  status: string;
  category: string;
}

export default function FeedbackPage() {
  const { status } = useSession();
  const router = useRouter();
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FeedbackFilter>({
    status: '',
    category: '',
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Fetch feedback items
  useEffect(() => {
    const getFeedback = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          // Build query string from filters
          const queryParams = new URLSearchParams();
          if (filter.status) queryParams.append('status', filter.status);
          if (filter.category) queryParams.append('category', filter.category);
          
          const data = await fetchWithAuth(`/feedback?${queryParams.toString()}`);
          setFeedbackItems(data.data.feedback);
        } catch (error) {
          console.error('Error fetching feedback:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    getFeedback();
  }, [status, filter]);
  
  // Handle filter changes
  const handleFilterChange = (newFilter: FeedbackFilter) => {
    setFilter(newFilter);
  };
  
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Feedback</h1>
        <Link
          href="/feedback/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit New Feedback
        </Link>
      </div>
      
      <div className="mb-6">
        <FeedbackFilter 
          currentFilter={filter} 
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FeedbackList 
          feedbackItems={feedbackItems} 
          onFeedbackUpdated={() => {
            // Refresh the list when feedback is updated
            const getFeedback = async () => {
              const data = await fetchWithAuth('/feedback');
              setFeedbackItems(data.data.feedback);
            };
            getFeedback();
          }}
        />
      )}
    </div>
  );
}