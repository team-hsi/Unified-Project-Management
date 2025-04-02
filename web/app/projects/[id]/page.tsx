import { fetchTasks } from "@/actions/task-actions";
import { ProjectHeader } from "@/components/project/project-header";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { ViewContainer } from "@/components/project/view-container";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (props: Props) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["board"], queryFn: fetchTasks });
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";

  return (
    <div className="p-4 flex flex-col gap-4">
      <ProjectHeader name={decodeURIComponent(params.id)} />
      <ViewContainer view={view} />
    </div>
  );
};

export default Page;
