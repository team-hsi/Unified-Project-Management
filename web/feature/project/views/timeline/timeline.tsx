import React from "react";
import CalendarApp from "./calender";
import { Skeleton } from "@/feature/shared/ui/skeleton";

export const TimelineView = () => {
  return (
    <div className=" h-full">
      <CalendarApp />
    </div>
  );
};

export const TimelineSkeleton = () => {
  return (
    <div className="h-full">
      <div className="calendar-container rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
        {/* Calendar Header Skeleton */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
