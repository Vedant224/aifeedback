import React from 'react';

// Define filter structure
interface FilterState {
  status: string;
  category: string;
}

// Define component props
interface FeedbackFilterProps {
  currentFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export default function FeedbackFilter({ currentFilter, onFilterChange }: FeedbackFilterProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilter,
      status: e.target.value
    });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilter,
      category: e.target.value
    });
  };
  
  const clearFilters = () => {
    onFilterChange({
      status: '',
      category: ''
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Feedback</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-xs text-gray-500 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={currentFilter.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="category-filter" className="block text-xs text-gray-500 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={currentFilter.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
      </div>
      
      {(currentFilter.status || currentFilter.category) && (
        <div className="mt-3 text-right">
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}