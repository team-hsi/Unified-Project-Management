import { ProjectBreadcrumbs } from "@/components/project/project-breadcrumbs";
const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProjectBreadcrumbs />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
};

export default ProjectLayout;
