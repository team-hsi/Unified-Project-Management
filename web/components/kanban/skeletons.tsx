import { Skeleton } from "@/components/ui/skeleton";

// Task Card Skeleton
export const KanbanCardSkeleton = () => {
  return (
    <div className="bg-background rounded-lg border p-3 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex -space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-6" />
        </div>
      </div>
    </div>
  );
};

// Kanban Column Skeleton
export const KanbanColumnSkeleton = () => {
  return (
    <div className="w-72 shrink-0 rounded-md border p-3">
      <Skeleton className="flex items-center w-full h-10 justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
          </div>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-3 ml-1 " />
        </div>
      </Skeleton>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <KanbanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const KanbanBoardSkeleton = () => {
  return (
    <div className="flex gap-6 overflow-x-auto mt-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <KanbanColumnSkeleton key={index} />
      ))}
    </div>
  );
};
