import { WorkspaceProjects } from "@/components/space/workspace-projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects page",
};

const Page = async () => {
  return (
    <div className="max-h-full overflow-hidden p-5">
      <WorkspaceProjects />
    </div>
  );
};

export default Page;
