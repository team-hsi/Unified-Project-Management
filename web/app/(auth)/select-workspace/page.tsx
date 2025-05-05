import { getUserWorkspaces } from "@/actions/api/workspace/queries";
import { getSession } from "@/actions/core/dal";
import SelectWorkspace from "@/feature/shared/components/workspace/select-space";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const page = async () => {
  const session = await getSession();
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: [session?.userId, "workspaces"],
    queryFn: getUserWorkspaces,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SelectWorkspace />;
    </HydrationBoundary>
  );
};

export default page;
