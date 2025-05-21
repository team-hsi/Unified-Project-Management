"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/feature/shared/ui/dialog";
import { FolderPlus } from "lucide-react";
import { emptyValue } from "../editor";
// import { useDocument } from "@/feature/shared/hooks/use-document";
import { NameDescriptionForm } from "@/feature/auth/components/name-description-form";
import { useMutation } from "@tanstack/react-query";
import { createDocument } from "@/actions/api/document/mutations";
import { useUtils } from "@/feature/shared/hooks/use-utils";
import { getQueryClient } from "@/lib/query-client/get-query-client";

export const NewDocument = ({ projectId }: { projectId: string }) => {
  // const { create } = useDocument();
  const { isValidResponse, toastUnknownError } = useUtils();
  const queryClient = getQueryClient();
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
  const handleCreate = async (data: { name: string }) => {
    await create.mutateAsync({
      name: data.name,
      content: emptyValue,
      projectId: projectId,
    });
  };
  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          <FolderPlus className="opacity-80" size={16} strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Create New Document
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            Fill in the details below to create your new project.
          </DialogDescription>
        </DialogHeader>
      </div>
      <NameDescriptionForm
        onSubmit={handleCreate}
        isPending={create.isPending}
        label="Create"
      />
    </DialogContent>
  );
};
