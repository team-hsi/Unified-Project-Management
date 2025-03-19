import { ProjectNavigation } from "@/components/project/project-navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const fetchProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
  return res.json();
};
const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <ProjectNavigation />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
};

export default ProjectLayout;
