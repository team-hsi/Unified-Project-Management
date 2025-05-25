import { getWorkspaceById } from "@/actions/api/workspace/queries";
import {
  ProjectsLoading,
  WorkspaceProjects,
} from "@/feature/workspace/workspace-projects";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById({ id: workspaceId });
  if (!workspace) {
    return {
      title: "Workspace Not Found",
    };
  }

  return {
    title: workspace.name || workspaceId,
  };
}

const Page = async () => {
  return (
    <React.Suspense fallback={<ProjectsLoading />}>
      <WorkspaceProjects />
    </React.Suspense>
  );
};

export default Page;
