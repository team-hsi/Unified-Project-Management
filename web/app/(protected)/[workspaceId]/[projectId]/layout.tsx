import { getProjectBuckets, getProjectItems } from "@/actions/project-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
type Props = {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
};

const ProjectLayout = async (props: Props) => {
  const params = await props.params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [params.projectId, "buckets"],
    queryFn: () => getProjectBuckets({ id: params.projectId }),
  });
  queryClient.prefetchQuery({
    queryKey: [params.projectId, "items"],
    queryFn: () => getProjectItems({ id: params.projectId }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
};

export default ProjectLayout;
