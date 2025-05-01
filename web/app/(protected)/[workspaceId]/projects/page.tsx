import { getWorkspaceById } from "@/actions/workspace-actions";
import { WorkspaceProjects } from "@/feature/shared/components/workspace/workspace-projects";
import { Metadata } from "next";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace.success) {
    return {
      title: "Workspace Not Found",
    };
  }

  return {
    title: workspace.data.name || workspaceId,
  };
}

const Page = async () => {
  return (
    <div className="max-h-full overflow-hidden p-5">
      <WorkspaceProjects />
    </div>
  );
};

export default Page;
