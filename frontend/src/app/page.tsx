import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-center mb-6">
        Feedback Tracker with AI Assistant
      </h1>
      
      <p className="text-lg text-center max-w-2xl mb-8">
        A secure and scalable platform for collecting, organizing, and responding to feedback. 
        Powered by AI to help you get answers quickly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>
        
        <Link
          href="/feedback/new"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Feedback
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          title="Track Feedback" 
          description="Organize and prioritize feedback items with ease."
        />
        <FeatureCard 
          title="AI Assistant" 
          description="Get instant answers to your questions using our AI assistant."
        />
        <FeatureCard 
          title="Secure & Reliable" 
          description="Built with security and reliability as top priorities."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}