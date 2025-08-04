import LoadingSpinner from '@/../components/ui/LoadingSpinner';

export default function DashboardLoading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner />
      <p className="ml-2 text-gray-600">Loading dashboard...</p>
    </div>
  );
}