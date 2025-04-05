import { ProjectHeader } from "@/components/project/project-header";
import { ViewContainer } from "@/components/project/view-container";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";

  return (
    <div className="p-4 flex flex-col gap-4 overflow-hidden">
      <ProjectHeader />
      <ViewContainer view={view} projectId={params.id} />
    </div>
  );
};

export default Page;
