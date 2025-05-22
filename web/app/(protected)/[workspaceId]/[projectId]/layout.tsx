import { getProjectBuckets } from "@/actions/api/bucket/queries";
import { getProjectDocuments } from "@/actions/api/document/queries";
import { getProjectItems } from "@/actions/api/item/queries";
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
  queryClient.prefetchQuery({
    queryKey: [params.projectId, "documents"],
    queryFn: () => getProjectDocuments(params.projectId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
};

export default ProjectLayout;
