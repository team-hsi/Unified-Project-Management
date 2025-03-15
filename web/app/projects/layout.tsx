import { ProjectNavigation } from "@/components/project/project-navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <ProjectNavigation />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProjectLayout;
