import { getSession } from "@/actions/core/dal";
import { getUserWorkspaces } from "@/actions/api/workspace/queries";
import { ProjectNavigation } from "@/feature/project/layout/navigation";
import { AppSidebar } from "@/feature/shared/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/feature/shared/ui/sidebar";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getWorkspaceProjects } from "@/actions/api/project/queries";
import { getSessionUser } from "@/actions/api/user/auth";
import { SpaceSync } from "@/feature/shared/components/workspace/space-sync";

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

  queryClient.setQueryData(["session"], session);
  queryClient.prefetchQuery({
    queryKey: [workspaceId, "projects"],
    queryFn: () => getWorkspaceProjects({ id: workspaceId }),
  });
  queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getSessionUser,
  });
  queryClient.prefetchQuery({
    queryKey: [session?.userId, "workspaces"],
    queryFn: getUserWorkspaces,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>
        <SpaceSync />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ProjectNavigation />
            <Suspense
              fallback={<div className="h-full w-full"> Loading 🌌</div>}
            >
              {children}
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
