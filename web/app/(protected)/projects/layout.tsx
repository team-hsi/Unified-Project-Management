import { ProjectNavigation } from "@/components/project/project-navigation";

const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProjectNavigation />
      {children}
    </>
  );
};

export default ProjectLayout;
