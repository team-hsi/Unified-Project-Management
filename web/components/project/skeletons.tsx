import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsSkeleton = () => {
  return (
    <div className="w-full max-w-[300px] p-4 space-y-4 rounded-lg">
      <Skeleton className="h-6 w-20" />
      <div className="space-y-2 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-2 rounded-md">
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
};
