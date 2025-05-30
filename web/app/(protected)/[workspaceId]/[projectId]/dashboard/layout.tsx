import { getProjectMatrix } from "@/actions/api/project/queries";
import { Card, CardContent, CardHeader } from "@/feature/shared/ui/card";
import { Skeleton } from "@/feature/shared/ui/skeleton";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type Props = {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
};

const ProjectLayout = async (props: Props) => {
  const params = await props.params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [params.projectId, "project-dashboard"],
    queryFn: () => getProjectMatrix({ id: params.projectId }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<LoadingSkeleton />}>{props.children}</Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default ProjectLayout;

const LoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Progress Card Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
