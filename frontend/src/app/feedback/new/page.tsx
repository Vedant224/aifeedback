'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import FeedbackForm from '@/../components/feedback/FeedbackForm';
import { fetchWithAuth } from '@/../lib/api';

// Define the type for feedback data
interface FeedbackData {
  title: string;
  description: string;
  category: string;
  priority?: string;
}

export default function NewFeedbackPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission with proper type annotation
  const handleSubmit = async (feedbackData: FeedbackData) => {
    try {
      setIsSubmitting(true);
      
      await fetchWithAuth('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      });
      
      toast.success('Feedback submitted successfully!');
      router.push('/feedback');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit New Feedback</h1>
      
      <FeedbackForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}