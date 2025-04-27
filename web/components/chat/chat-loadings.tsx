import { Skeleton } from "../ui/skeleton";

export const ChatHeaderLoading = () => {
  return (
    <div className="border-b border-chat-border bg-chat-header p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-3 space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Skeleton loader while rooms are loading
export const ChatListLoading = () => {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 bg-muted rounded-md animate-pulse" />
      ))}
    </div>
  );
};
