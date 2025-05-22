"use client";

import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useUtils } from "./use-utils";
import { getProjectDocuments } from "@/actions/api/document/queries";
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "@/actions/api/document/mutations";

export const useDocument = () => {
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { projectId } = useParams<{ projectId: string }>();

  // Get workspace projects
  const {
    data: projectDocuments,
    isPending: isLoading,
    error: error,
  } = useSuspenseQuery({
    queryKey: [projectId, "documents"],
    queryFn: () => getProjectDocuments(projectId),
  });

  // Create project mutation
  const create = useMutation({
    mutationFn: createDocument,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [projectId, "documents"],
      });
    },
    onError: toastUnknownError,
  });

  // Update project mutation
  const update = useMutation({
    mutationFn: updateDocument,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [projectId, "documents"],
      });
    },
    onError: toastUnknownError,
  });

  // Delete project mutation
  const remove = useMutation({
    mutationFn: async (id: string) => await deleteDocument(id, projectId),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [projectId, "documents"],
      });
    },
    onError: toastUnknownError,
  });

  return {
    // Queries
    projectDocuments,
    isLoading,
    error,
    // Mutations
    create,
    update,
    remove,
    // Utilities
  };
};
