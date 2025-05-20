import { FolderPlus, PlusCircle } from "lucide-react";
import React from "react";
import { Button } from "@/feature/shared/ui/button";
import { CreateProjectDialog } from "../overlays/create-project";

export const EmptyProjects = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FolderPlus />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No projects created</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You haven&apos;t created any projects yet. Start by creating your
          first project.
        </p>
        <CreateProjectDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create your first project
          </Button>
        </CreateProjectDialog>
      </div>
    </div>
  );
};
