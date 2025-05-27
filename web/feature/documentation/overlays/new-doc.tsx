"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/feature/shared/ui/dialog";
import { FolderPlus, PlusCircle } from "lucide-react";
// import { useDocument } from "@/feature/shared/hooks/use-document";
import { NameDescriptionForm } from "@/feature/auth/components/name-description-form";
import { useMutation } from "@tanstack/react-query";
import { createDocument } from "@/actions/api/document/mutations";
import { useUtils } from "@/feature/shared/hooks/use-utils";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { Button } from "@/feature/shared/ui/button";
import React from "react";
export const NewDocument = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = React.useState(false);
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
      content: docPlaceholderContent,
      projectId: projectId,
    });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
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
          nameOnly={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export const docPlaceholderContent = `<h1>Welcome to Your Project Management Hub</h1>
<p>This document editor is part of our comprehensive project management platform. Start typing to replace this content with your own ideas, plans, and documentation.</p>

<h2>🚀 What You Can Do Here</h2>
<ul>
  <li>
    <p><strong>Rich Text Editing</strong> - Format text with <strong>bold</strong>, <em>italic</em>, and <u>underline</u></p>
  </li>

</ul>

<h2>📋 Project Documentation Ideas</h2>
<p>Use this space to document:</p>
<ul>
  <li><input type="checkbox" disabled> Project requirements and specifications</li>
</ul>

<h2>💡 Pro Tips</h2>
<blockquote>
  <p><em>Select any text to see formatting options in the bubble menu. Try the AI features to enhance your writing instantly!</em></p>
</blockquote>

`;
