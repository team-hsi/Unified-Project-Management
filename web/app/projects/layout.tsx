import { getProjects } from "@/actions/project-actions";
import { ProjectNavigation } from "@/components/project/project-navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: getProjects });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ProjectNavigation />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
};

export default ProjectLayout;
