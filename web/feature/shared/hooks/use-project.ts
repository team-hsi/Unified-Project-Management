"use client";

import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { getWorkspaceProjects } from "../actions/api/project/queries";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../actions/api/project/mutations";
import { getProjectBuckets } from "../actions/api/bucket/queries";
import { getProjectItems } from "../actions/api/item/queries";

export const useProject = () => {
  const queryClient = getQueryClient();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  // Get workspace projects
  const {
    data: workspaceProjects,
    isPending: isLoadingWp,
    error: errorWp,
  } = useSuspenseQuery({
    queryKey: [workspaceId, "projects"],
    queryFn: () => getWorkspaceProjects({ id: workspaceId }),
  });

  // Create project mutation
  const create = useMutation({
    mutationFn: async (data: { name: string }) =>
      await createProject({ ...data, spaceId: workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
  });

  // Update project mutation
  const update = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
  });

  // Delete project mutation
  const remove = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
  });

  // Prefetch projects data
  // const prefetchWorkspace = (workspaceId: string) => {
  //   queryClient.prefetchQuery({
  //     queryKey: [workspaceId, "projects"],
  //     queryFn: () => getWorkspaceProjects({ id: workspaceId }),
  //   });
  // };

  const prefetchProject = (projectId: string) => {
    queryClient.prefetchQuery({
      queryKey: [projectId, "buckets"],
      queryFn: () => getProjectBuckets({ id: projectId }),
    });
    queryClient.prefetchQuery({
      queryKey: [projectId, "items"],
      queryFn: () => getProjectItems({ id: projectId }),
    });
  };

  return {
    // Queries
    workspaceProjects,
    isLoadingWp,
    errorWp,
    // Mutations
    create,
    update,
    remove,
    // Utilities
    prefetchProject,
  };
};
