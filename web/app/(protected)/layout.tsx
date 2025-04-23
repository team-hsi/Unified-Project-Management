import { verifySession } from "@/actions/dal";
import { getUserProjects } from "@/actions/project-actions";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  await verifySession();
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["projects", "user"],
    queryFn: getUserProjects,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </HydrationBoundary>
  );
};

export default ProtectedLayout;
