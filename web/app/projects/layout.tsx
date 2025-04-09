// import { verifySession } from "@/actions/dal";
import { verifySession } from "@/actions/dal";
import { getUserProjects } from "@/actions/project-actions";
import { ProjectNavigation } from "@/components/project/project-navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { ProjectStoreProvider } from "@/lib/stores/store-provider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  await verifySession();
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["projects", "user"],
    queryFn: getUserProjects,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <ProjectStoreProvider>
          {/* <ProjectUrlSync /> */}
          <AppSidebar />
          <SidebarInset>
            <ProjectNavigation />
            {children}
          </SidebarInset>
        </ProjectStoreProvider>
      </SidebarProvider>
    </HydrationBoundary>
  );
};

export default ProjectLayout;
