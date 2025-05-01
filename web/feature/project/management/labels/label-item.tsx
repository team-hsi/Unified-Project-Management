"use client";
import { Button } from "@/feature/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LabelForm } from "./label-form";
import React from "react";
import { Badge } from "@/feature/shared/ui/badge";
import { useLabels } from "@/feature/shared/hooks/use-labels";
import { Edit2, Trash2 } from "lucide-react";
import { DeleteLabel } from "./delete-label";
import { Label } from "@/feature/shared/@types/label";

interface LabelItemProps {
  label: Label;
}

export function LabelItem({ label }: LabelItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { updateLabel, deleteLabel } = useLabels({
    projectId: label.project.id,
  });

  const handleDelete = async () => {
    await deleteLabel.mutateAsync({ id: label.id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        opacity: { duration: 0.2 },
        height: { duration: 0.3 },
      }}
    >
      <div className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
        <div className="flex items-center gap-4">
          <Badge
            className="px-3 py-1 text-sm font-medium text-white"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditing(true);
            }}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <DeleteLabel confirmDelete={handleDelete}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </DeleteLabel>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3 },
            }}
          >
            <div className="p-4 bg-muted/10 border-t">
              <LabelForm
                initialData={{ name: label.name, color: label.color }}
                onCancel={() => {
                  setIsEditing(false);
                }}
                onSave={async (values) => {
                  await updateLabel.mutateAsync({ ...values, id: label.id });
                  setIsEditing(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
