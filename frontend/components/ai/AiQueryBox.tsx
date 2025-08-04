'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/../lib/api';

export default function AiQueryBox() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    if (!session) {
      toast.error('You must be logged in to use the AI assistant');
      return;
    }
    
    try {
      setIsLoading(true);
      setResponse(null);
      
      const data = await fetchWithAuth('/api/ai/query', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      
      setResponse(data.data.answer);
      
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How do I categorize bug reports?",
    "What's the best way to prioritize feedback?",
    "How can I track the status of my feedback?",
    "What information should I include when reporting a bug?"
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
      <p className="text-sm text-gray-600 mb-4">
        Ask any question about feedback tracking and management.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about feedback..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !session}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {500 - prompt.length} characters remaining
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || !session}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Ask AI Assistant'}
        </button>
      </form>
      
      {!response && !isLoading && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Try asking:</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="text-sm text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100 w-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {response && (
        <div ref={responseRef} className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">AI Response:</h3>
          <div className="text-gray-700 whitespace-pre-line prose prose-sm max-w-none">
            {response}
          </div>
        </div>
      )}
      
      {!session && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            Please sign in to use the AI assistant.
          </p>
        </div>
      )}
    </div>
  );
}