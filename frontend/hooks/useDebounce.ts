'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/../lib/api';
import { Feedback, FeedbackFilters } from '@/../lib/types';

export function useFeedback(filters?: FeedbackFilters) {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.category) queryParams.append('category', filters.category);
        
        const data = await fetchWithAuth(`/feedback?${queryParams.toString()}`);
        setFeedbackItems(data.data.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch feedback');
      } finally {
        setIsLoading(false);
      }
    };
    
    getFeedback();
  }, [filters]);

  const refreshFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.category) queryParams.append('category', filters.category);
      
      const data = await fetchWithAuth(`/feedback?${queryParams.toString()}`);
      setFeedbackItems(data.data.feedback);
    } catch (error) {
      console.error('Error refreshing feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return { feedbackItems, isLoading, error, refreshFeedback };
}