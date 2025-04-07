import { Metadata } from "next";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { getProjectBuckets } from "@/actions/bucket-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getProjectItems } from "@/actions/item-actions";
import { getProject } from "@/actions/project-actions";
type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const project = await getProject(id);
  if (!project.success) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.data.name || id,
  };
}

const ProjectLayout = async (props: Props) => {
  const params = await props.params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["buckets", params.id],
    queryFn: () => getProjectBuckets({ id: params.id }),
  });
  queryClient.prefetchQuery({
    queryKey: ["items", params.id],
    queryFn: () => getProjectItems({ id: params.id }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
};

export default ProjectLayout;
