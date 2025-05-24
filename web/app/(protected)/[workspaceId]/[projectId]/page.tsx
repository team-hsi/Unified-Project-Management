import { getProjectById } from "@/actions/api/project/queries";
import { ProjectHeader } from "@/feature/project/layout/project-header";
import { ViewContainerWrapper } from "@/feature/project/views/view-container-wrapper";
import { Metadata } from "next";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;

  const project = await getProjectById({ id: projectId });
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.name || projectId,
  };
}

const Page = async (props: Props) => {
  const params = await props.params;
  const project = await getProjectById({ id: params.projectId });
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";

  return (
    <div className="p-4 flex flex-col gap-4 overflow-hidden h-full">
      <ProjectHeader project={project} />
      <ViewContainerWrapper initialView={view} />
    </div>
  );
};

export default Page;
