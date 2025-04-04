// Page.tsx
import { fetchTasks } from "@/actions/task-actions";
import { fetchBuckets } from "@/actions/bucket-actions";
import { ProjectHeader } from "@/components/project/project-header";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { ViewContainer } from "@/components/project/view-container";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (props: Props) => {
  const queryClient = getQueryClient();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";

  // Prefetch tasks
  await queryClient.prefetchQuery({ queryKey: ["board"], queryFn: fetchTasks });

  // Prefetch columns
  await queryClient.prefetchQuery({
    queryKey: ["columns", params.id],
    queryFn: () => fetchBuckets(params.id),
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <ProjectHeader id={params.id} />
      <ViewContainer view={view} id={params.id} />
    </div>
  );
};

export default Page;