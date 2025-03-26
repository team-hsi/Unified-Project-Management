export function ListViewSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border animate-pulse">
        {/* Header placeholder */}
        <div className="flex h-10 bg-gray-200">
          <div className="w-1/6 h-full bg-gray-300" />
          <div className="w-1/6 h-full bg-gray-200" />
          <div className="w-1/6 h-full bg-gray-300" />
          <div className="w-1/6 h-full bg-gray-200" />
          <div className="w-1/6 h-full bg-gray-300" />
          <div className="w-1/6 h-full bg-gray-200" />
        </div>
        {/* Rows placeholder */}
        <div className="space-y-2 p-4">
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
