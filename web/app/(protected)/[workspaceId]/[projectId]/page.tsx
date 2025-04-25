import { ProjectHeader } from "@/components/project/project-header";
import { ViewContainer } from "@/components/project/view-container";
import { getProject } from "@/actions/project-actions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;

  const project = await getProject(projectId);
  if (!project.success) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.data.name || projectId,
  };
}
const Page = async (props: Props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";
  const project = await getProject(params.projectId);

  if (!project.success) {
    return <div>Project Not Found</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-4 overflow-hidden h-full">
      <ProjectHeader project={project.data} />
      <ViewContainer view={view} />
    </div>
  );
};

export default Page;
