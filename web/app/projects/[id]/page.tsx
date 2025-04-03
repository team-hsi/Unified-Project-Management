import { ProjectHeader } from "@/components/project/project-header";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { ViewContainer } from "@/components/project/view-container";
import { getBuckets } from "@/actions/bucket-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getItems } from "@/actions/item-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const projectId = decodeURIComponent(params.id);
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["buckets", projectId],
    queryFn: getBuckets,
  });
  queryClient.prefetchQuery({
    queryKey: ["items", projectId],
    queryFn: getItems,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4 flex flex-col gap-4">
        <ProjectHeader name={decodeURIComponent(params.id)} />
        <ViewContainer view={view} projectId={projectId} />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
