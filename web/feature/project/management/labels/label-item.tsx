"use client";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Label } from "@/feature/shared/ui/label";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { DeleteLabel } from "./delete-label";
import { Label as LabelType } from "@/feature/shared/@types/label";
import { useLabel } from "@/feature/shared/hooks/use-label";
import { Badge } from "@/feature/shared/ui/badge";

interface LabelItemProps {
  label: LabelType;
}

export function LabelItem({ label }: LabelItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(label.name);
  const [editedColor, setEditedColor] = useState(label.color);
  const { update, remove } = useLabel({
    projectId: label.project.id,
  });

  const handleSave = async () => {
    await update.mutateAsync({
      id: label.id,
      name: editedName,
      color: editedColor,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await remove.mutateAsync(label.id);
  };

  return (
    <div className="p-4 hover:bg-accent/5 transition-all duration-300">
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div>
                <Label
                  htmlFor="label-name"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Label name
                </Label>
                <Input
                  id="label-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1.5 bg-background/50 hover:bg-accent/5 transition-all duration-200 focus:bg-background h-9"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="label-color"
                className="text-sm font-medium text-muted-foreground"
              >
                Color
              </Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  id="label-color"
                  type="color"
                  value={editedColor}
                  onChange={(e) => setEditedColor(e.target.value)}
                  className="h-9 w-16 p-1 bg-background/50 hover:bg-accent/5 transition-all duration-200 focus:bg-background"
                />
                <div
                  className="h-9 w-9 rounded-lg shadow-inner"
                  style={{ backgroundColor: editedColor }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="hover:bg-accent/5 transition-all duration-200 h-8"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 h-8"
            >
              <Check className="h-4 w-4 mr-2" />
              Save changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="px-3 py-1.5 border-2 hover:border-primary/50 transition-all duration-300"
            style={{ borderColor: label.color }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span className="font-medium">{label.name}</span>
            </div>
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="hover:bg-accent/5 transition-all duration-200 h-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <DeleteLabel confirmDelete={handleDelete}>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-destructive/10 text-destructive hover:text-destructive transition-all duration-200 h-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteLabel>
          </div>
        </div>
      )}
    </div>
  );
}
