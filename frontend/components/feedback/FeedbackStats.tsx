import React from 'react';

// Define feedback item structure
interface FeedbackItem {
  _id: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: 'bug' | 'feature' | 'improvement';
}

// Define props for FeedbackStats component
interface FeedbackStatsProps {
  feedbackItems: FeedbackItem[];
}

// Define props for StatCard component
interface StatCardProps {
  title: string;
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray';
}

export default function FeedbackStats({ feedbackItems }: FeedbackStatsProps) {
  // Calculate stats
  const totalFeedback = feedbackItems.length;
  
  const openCount = feedbackItems.filter((item: FeedbackItem) => item.status === 'open').length;
  const inProgressCount = feedbackItems.filter((item: FeedbackItem) => item.status === 'in-progress').length;
  const resolvedCount = feedbackItems.filter((item: FeedbackItem) => item.status === 'resolved').length;
  
  const bugCount = feedbackItems.filter((item: FeedbackItem) => item.category === 'bug').length;
  const featureCount = feedbackItems.filter((item: FeedbackItem) => item.category === 'feature').length;
  const improvementCount = feedbackItems.filter((item: FeedbackItem) => item.category === 'improvement').length;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Feedback Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Feedback" value={totalFeedback} />
        
        <StatCard title="Open" value={openCount} color="blue" />
        <StatCard title="In Progress" value={inProgressCount} color="yellow" />
        <StatCard title="Resolved" value={resolvedCount} color="green" />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">By Category</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Bugs" value={bugCount} color="red" />
          <StatCard title="Features" value={featureCount} color="purple" />
          <StatCard title="Improvements" value={improvementCount} color="indigo" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = 'gray' }: StatCardProps) {
  const getColorClass = (): string => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      case 'purple': return 'text-purple-600';
      case 'indigo': return 'text-indigo-600';
      default: return 'text-gray-800';
    }
  };
  
  return (
    <div className="text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-xl font-semibold ${getColorClass()}`}>{value}</p>
    </div>
  );
}