"use client";

import { useSuspenseQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import {
  getProjectMembers,
  getWorkspaceProjects,
} from "@/actions/api/project/queries";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/actions/api/project/mutations";
import { getProjectBuckets } from "@/actions/api/bucket/queries";
import { getProjectItems } from "@/actions/api/item/queries";
import { useUtils } from "./use-utils";

export const useProject = () => {
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

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
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
    onError: toastUnknownError,
  });

  // Update project mutation
  const update = useMutation({
    mutationFn: updateProject,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
    onError: toastUnknownError,
  });

  // Delete project mutation
  const remove = useMutation({
    mutationFn: async (id: string) =>
      await deleteProject({ id, spaceId: workspaceId }),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
    },
    onError: toastUnknownError,
  });

  const {
    data: projectMembers,
    isPending: isLoadingPm,
    error: errorPm,
  } = useQuery({
    queryKey: [projectId, "proj-members"],
    queryFn: () => getProjectMembers({ id: projectId }),
    enabled: !!projectId,
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
    projectMembers,
    isLoadingPm,
    errorPm,
    // Mutations
    create,
    update,
    remove,
    // Utilities
    prefetchProject,
  };
};
