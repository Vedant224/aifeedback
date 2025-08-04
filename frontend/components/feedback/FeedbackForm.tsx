'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';

// Define feedback data structure
interface FeedbackData {
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement';
}

// Define component props
interface FeedbackFormProps {
  onSubmit: (data: FeedbackData) => void;
  isSubmitting: boolean;
  initialData?: FeedbackData | null;
}

export default function FeedbackForm({ 
  onSubmit, 
  isSubmitting,
  initialData = null 
}: FeedbackFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<FeedbackData['category']>(
    (initialData?.category as FeedbackData['category']) || 'bug'
  );
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      category
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={3}
          maxLength={100}
          placeholder="Brief title for your feedback"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          rows={6}
          minLength={10}
          placeholder="Detailed description of your feedback"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
            setCategory(e.target.value as FeedbackData['category'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          required
        >
          <option value="bug">Bug</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Improvement</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : initialData ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}