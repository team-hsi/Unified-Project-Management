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
          <Skeleton className="bg-muted w-12 h-full" /> {/* ID */}
          <Skeleton className="bg-muted w-12 h-full" /> {/* Select */}
          <Skeleton className="bg-muted w-32 h-full" /> {/* Task */}
          <Skeleton className="bg-muted flex-1 h-full" /> {/* Title */}
          <Skeleton className="bg-muted w-32 h-full" /> {/* Status */}
          <Skeleton className="bg-muted w-24 h-full" /> {/* Priority */}
          <Skeleton className="bg-muted w-32 h-full" /> {/* Assigned To */}
          <Skeleton className="bg-muted w-32 h-full" /> {/* Created At */}
          <Skeleton className="bg-muted w-24 h-full" /> {/* Actions */}
        </div>
        {/* Table rows placeholder */}
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex h-8">
              <Skeleton className="bg-muted w-12 h-full" /> {/* ID */}
              <Skeleton className="bg-muted w-12 h-full ml-2" /> {/* Select */}
              <Skeleton className="bg-muted w-32 h-full ml-2" /> {/* Task */}
              <Skeleton className="bg-muted flex-1 h-full ml-2" /> {/* Title */}
              {/* Status (button-like with icon) */}
              <div className="inline-flex items-center space-x-2 px-2 py-1 border  rounded-md ml-2">
                <Skeleton className="bg-muted h-5 w-5" /> {/* Icon */}
                <Skeleton className="bg-muted h-4 w-16" /> {/* Text */}
              </div>
              {/* Priority (button-like with icon) */}
              <div className="inline-flex items-center space-x-2 px-2 py-1 border rounded-md ml-2">
                <Skeleton className="bg-muted h-5 w-5" /> {/* Icon */}
                <Skeleton className="bg-muted h-4 w-12" /> {/* Text */}
              </div>
              <Skeleton className="bg-muted w-32 h-full ml-2" />{" "}
              {/* Assigned To */}
              <Skeleton className="bg-muted w-32 h-full ml-2" />{" "}
              {/* Created At */}
              <Skeleton className="bg-muted w-24 h-full ml-2" /> {/* Actions */}
            </div>
          ))}
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
