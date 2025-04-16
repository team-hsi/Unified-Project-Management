import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const LabelsLoading = () => {
  return (
    <>
      <div className="mb-4 rounded-md bg-background p-4">
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-0 rounded-md border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b last:border-b-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
