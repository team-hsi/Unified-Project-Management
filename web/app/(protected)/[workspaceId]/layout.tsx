import { getSessionUser } from "@/actions/auth-actions";
import { getSession } from "@/actions/dal";
import { getUserWorkspaces } from "@/actions/user-actions";
import { getWorkspaceProjects } from "@/actions/workspace-actions";
import { ProjectNavigation } from "@/components/project/project-navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const WorkspaceLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const session = await getSession();
  const { workspaceId } = await params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: [workspaceId, "projects"],
    queryFn: getWorkspaceProjects,
  });
  queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getSessionUser,
  });
  queryClient.prefetchQuery({
    queryKey: [session.userId, "workspaces"],
    queryFn: getUserWorkspaces,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ProjectNavigation />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
