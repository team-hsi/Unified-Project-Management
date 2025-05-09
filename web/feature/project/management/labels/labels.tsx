"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogContent,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Card } from "@/feature/shared/ui/card";
import { Input } from "@/feature/shared/ui/input";
import { LabelItem } from "./label-item";
import { LabelForm } from "./label-form";
import { EmptyLabels } from "./empty-labels";
import { Tag, Plus, Search, Palette } from "lucide-react";
import type { Project } from "@/feature/shared/@types/projects";
import { useState } from "react";
import { useLabel } from "@/feature/shared/hooks/use-label";

interface LabelsViewProps {
  project: Project;
}

export function LabelsView({ project }: LabelsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { labels, create } = useLabel({
    projectId: project.id,
  });

  const filteredLabels =
    labels?.filter((label) =>
      label.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          <Tag className="h-5 w-5 text-primary" />
          Labels for {project.name}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Manage labels to categorize and organize your project items.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Search and Create Section */}
        <Card className="p-4 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 border-accent/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search labels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 hover:bg-accent/5 transition-all duration-200 focus:bg-background h-9"
              />
            </div>
            <Button
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 h-9"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Label
            </Button>
          </div>
        </Card>

        {/* Label Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 border-accent/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Total Labels
                </h4>
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {labels?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 border-accent/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Color Schemes
                </h4>
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {new Set(labels?.map((label) => label.color) || []).size}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Labels List */}
        {filteredLabels.length > 0 ? (
          <Card className="bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 border-accent/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="divide-y divide-border/50">
              {filteredLabels.map((label) => (
                <LabelItem key={label.id} label={label} />
              ))}
            </div>
          </Card>
        ) : (
          <EmptyLabels onCreateClick={() => setIsCreating(true)} />
        )}
      </div>

      {/* Create Label Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[425px]">
          <LabelForm
            onClose={() => setIsCreating(false)}
            onSave={async (values) => {
              await create.mutateAsync({
                ...values,
                projectId: project.id,
              });
              setIsCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
