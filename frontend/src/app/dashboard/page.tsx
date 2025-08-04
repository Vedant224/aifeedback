'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FeedbackList from '@/../components/feedback/FeedbackList';
import FeedbackFilter from '@/../components/feedback/FeedbackFilter';
import FeedbackStats from '@/../components/feedback/FeedbackStats';
import AiQueryBox from '@/../components/ai/AiQueryBox';
import LoadingSpinner from '@/../components/ui/LoadingSpinner';
import { fetchWithAuth } from '@/../lib/api';

// Define types for the filter
interface FeedbackFilter {
  status: string;
  category: string;
}

export default function DashboardPage() {
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
  
  // Handle filter changes with proper type annotation
  const handleFilterChange = (newFilter: FeedbackFilter) => {
    setFilter(newFilter);
  };
  
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <FeedbackStats feedbackItems={feedbackItems} />
        
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
      
      <div>
        <AiQueryBox />
      </div>
    </div>
  );
}