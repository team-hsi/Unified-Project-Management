"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabels } from "@/hooks/use-labels";
import { LabelsLoading } from "./labels-loading";
import { EmptyLabelState } from "./empty-labels";
import type { Project } from "@/@types/projects";
import { LabelForm } from "./label-form";
import React from "react";
import { LabelItem } from "./label-item";
import { Label } from "@/@types/label";

export const LabelsView = ({ project }: { project: Project }) => {
  const { labels } = useLabels({
    projectId: project.id,
  });
  const [isAddingLabel, setIsAddingLabel] = React.useState(false);
  const { addLabel } = useLabels({ projectId: project.id });

  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">
          Labels for {project.name}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Manage labels for your projects.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-muted/30 p-4">
          <div className="text-sm font-medium">
            {labels.data?.data.length || 0} Labels
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => setIsAddingLabel((prev) => !prev)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add label
          </Button>
        </div>

        {labels.isLoading ? (
          <LabelsLoading />
        ) : labels.data?.data.length === 0 && !isAddingLabel ? (
          <EmptyLabelState />
        ) : (
          <div className="bg-background divide-y">
            <AnimatePresence>
              {isAddingLabel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.3 },
                  }}
                >
                  <div className="p-4 bg-muted/10">
                    <LabelForm
                      onSave={async (values) => {
                        await addLabel.mutateAsync({
                          ...values,
                          projectId: project.id,
                        });
                        setIsAddingLabel(false);
                      }}
                      initialData={{
                        name: "",
                        color: "",
                      }}
                      onCancel={() => setIsAddingLabel(false)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {labels.data?.data.length > 0 &&
              labels.data?.data.map((label: Label) => (
                <LabelItem key={label.id} label={label} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
