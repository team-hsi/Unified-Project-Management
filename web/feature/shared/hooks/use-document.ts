"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useUtils } from "./use-utils";
import { getProjectDocuments } from "@/actions/api/document/queries";
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "@/actions/api/document/mutations";
import { Document } from "../@types/document";
import { BaseError } from "@/lib/errors";

export const useDocument = () => {
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { projectId } = useParams<{ projectId: string }>();

  // Get workspace projects
  const {
    data: projectDocuments,
    isPending: isLoading,
    error: error,
  } = useQuery({
    queryKey: [projectId, "documents"],
    queryFn: () => getProjectDocuments(projectId),
    enabled: !!projectId,
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
    mutationFn: deleteDocument,
    onMutate: async ({ id, projectId }) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "documents"] });
      const previousDocs = queryClient.getQueryData([projectId, "documents"]);
      queryClient.setQueryData([projectId, "documents"], (old: Document[]) => {
        return old?.filter((doc: Document) => doc.id !== id) ?? [];
      });
      return { previousDocs };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData([projectId, "documents"], context?.previousDocs);
      toastUnknownError(err as BaseError);
    },
    onSuccess: (response) => {
      void isValidResponse(response);
      queryClient.invalidateQueries({ queryKey: [projectId, "documents"] });
    },
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
