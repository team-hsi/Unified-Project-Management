import { ProjectHeader } from "@/components/project/project-header";
import { ViewContainer } from "@/components/project/view-container";
import { getProject } from "@/actions/project-actions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const project = await getProject(id);
  if (!project.success) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.data.name || id,
  };
}
const Page = async (props: Props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";
  const project = await getProject(params.id);

  if (!project.success) {
    return <div>Project Not Found</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-4 overflow-hidden">
      <ProjectHeader project={project.data} />
      <ViewContainer view={view} projectId={params.id} />
    </div>
  );
};

export default Page;
