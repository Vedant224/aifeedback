import Link from 'next/link';

export default function FeedbackNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Feedback Not Found</h2>
      <p className="mb-6 text-gray-600 max-w-md">
        We couldn&apos;t find the feedback item you&apos;re looking for. It may have been deleted or you may have entered an incorrect URL.
      </p>
      <Link
        href="/feedback"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View All Feedback
      </Link>
    </div>
  );
}