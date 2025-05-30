import { getSession } from "@/actions/core/dal";
import { getUserWorkspaces } from "@/actions/api/workspace/queries";
import { ProjectNavigation } from "@/feature/project/layout/navigation";
import { AppSidebar } from "@/feature/shared/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/feature/shared/ui/sidebar";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getWorkspaceProjects } from "@/actions/api/project/queries";
import { SpaceSync } from "@/feature/workspace/space-sync";
import { getCurrentUser } from "@/actions/api/user/queries";
import { WebSocketProvider } from "@/lib/socket/WebSocketProvider";

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
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [workspaceId, "projects"],
      queryFn: () => getWorkspaceProjects({ id: workspaceId }),
    }),
    queryClient.prefetchQuery({
      queryKey: [session?.userId, "workspaces"],
      queryFn: getUserWorkspaces,
    }),
    queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: getCurrentUser,
    }),
  ]);
  queryClient.setQueryData(["session"], session);
  // queryClient.prefetchQuery({
  //   queryKey: [workspaceId, "projects"],
  //   ,
  // });
  // queryClient.prefetchQuery({
  //   queryKey: ["user"],

  // });
  // queryClient.prefetchQuery({
  //   queryKey: [session?.userId, "workspaces"],

  // });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>
        <WebSocketProvider>
          <SpaceSync />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <ProjectNavigation />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </WebSocketProvider>
      </AuthProvider>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
