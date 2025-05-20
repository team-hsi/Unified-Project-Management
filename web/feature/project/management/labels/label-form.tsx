"use client";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Label } from "@/feature/shared/ui/label";
import { Tag, Plus, X } from "lucide-react";
import { useState } from "react";

interface LabelFormProps {
  onClose: () => void;
  onSave: (values: {
    name: string;
    color: string;
    description?: string;
  }) => Promise<void>;
  initialData?: {
    name: string;
    color: string;
    description?: string;
  };
}

export function LabelForm({ onClose, onSave, initialData }: LabelFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [color, setColor] = useState(initialData?.color || "#3b82f6");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, color, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          {initialData ? "Edit Label" : "Create New Label"}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-accent/5"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="label-name" className="text-sm font-medium">
              Label name
            </Label>
            <Input
              id="label-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter label name"
              className="mt-1.5 bg-background hover:bg-accent/5"
            />
          </div>

          <div>
            <Label htmlFor="label-description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="label-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter label description"
              className="mt-1.5 bg-background hover:bg-accent/5"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label-color" className="text-sm font-medium">
              Color
            </Label>
            <div className="mt-1.5 flex items-center gap-4">
              <Input
                id="label-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 p-1 bg-background hover:bg-accent/5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Preview</div>
                    <div className="text-xs text-muted-foreground">
                      This color will be used for the label badge
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Label className="text-sm font-medium">Suggested Colors</Label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {[
                "#ef4444", // red
                "#f97316", // orange
                "#eab308", // yellow
                "#22c55e", // green
                "#3b82f6", // blue
                "#8b5cf6", // purple
                "#ec4899", // pink
                "#14b8a6", // teal
                "#6366f1", // indigo
                "#84cc16", // lime
                "#f43f5e", // rose
                "#06b6d4", // cyan
              ].map((suggestedColor) => (
                <button
                  key={suggestedColor}
                  type="button"
                  className="h-8 w-8 rounded-md hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                  style={{ backgroundColor: suggestedColor }}
                  onClick={() => setColor(suggestedColor)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="hover:bg-accent/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          {initialData ? "Update Label" : "Create Label"}
        </Button>
      </div>
    </form>
  );
}
