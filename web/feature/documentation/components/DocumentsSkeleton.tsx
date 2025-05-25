export const DocumentsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="rounded-lg border bg-muted animate-pulse h-40 flex flex-col justify-between"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 bg-gray-300 rounded" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
