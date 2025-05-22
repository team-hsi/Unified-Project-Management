"use client";
import { Button } from "@/feature/shared/ui/button";
import { Card } from "@/feature/shared/ui/card";
import { Tag, Plus } from "lucide-react";

interface EmptyLabelsProps {
  onCreateClick?: () => void;
}

export function EmptyLabels({ onCreateClick }: EmptyLabelsProps) {
  return (
    <Card className="p-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 border-accent/20 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
        <Tag className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          No labels found
        </h3>
        <p className="text-muted-foreground mt-1">
          Create labels to organize your project items
        </p>
      </div>
      <Button
        onClick={onCreateClick}
        className="mt-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Label
      </Button>
    </Card>
  );
}
