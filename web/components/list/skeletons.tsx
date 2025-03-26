import { Skeleton } from "@/components/ui/skeleton";

export function ListViewSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-4">
      {/* Header placeholder (Search input and action buttons) */}
      <div className="flex items-center justify-between">
        {/* Search input placeholder */}
        <div className="flex items-center space-x-2">
          <Skeleton className="bg-muted h-10 w-64 rounded" />
        </div>
        {/* Action buttons placeholder */}
        <div className="flex items-center space-x-2">
          <Skeleton className="bg-muted h-10 w-24 rounded" />
          <Skeleton className="bg-muted h-10 w-24 rounded" />
          <Skeleton className="bg-muted h-10 w-24 rounded" />
        </div>
      </div>

      {/* Table placeholder */}
      <div className="rounded-md border">
        {/* Table header placeholder */}
        <div className="flex h-12">
          <Skeleton className="bg-muted w-1/6 h-full" />
          <Skeleton className="bg-muted w-1/6 h-full" />
          <Skeleton className="bg-muted w-1/6 h-full" />
          <Skeleton className="bg-muted w-1/6 h-full" />
          <Skeleton className="bg-muted w-1/6 h-full" />
          <Skeleton className="bg-muted w-1/6 h-full" />
        </div>
        {/* Table rows placeholder */}
        <div className="space-y-2 p-4">
          <Skeleton className="bg-muted h-8 w-full rounded" />
          <Skeleton className="bg-muted h-8 w-full rounded" />
          <Skeleton className="bg-muted h-8 w-full rounded" />
          <Skeleton className="bg-muted h-8 w-full rounded" />
          <Skeleton className="bg-muted h-8 w-full rounded" />
        </div>
      </div>

      {/* Pagination controls placeholder */}
      <div className="flex items-center justify-between space-x-2 py-4">
        {/* Left side: Row selection info placeholder */}
        <Skeleton className="bg-muted h-6 w-32 rounded" />
        {/* Right side: Rows per page and navigation placeholder */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="bg-muted h-6 w-24 rounded" />
            <Skeleton className="bg-muted h-6 w-12 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="bg-muted h-6 w-16 rounded" />
            <Skeleton className="bg-muted h-8 w-20 rounded" />
            <Skeleton className="bg-muted h-8 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
