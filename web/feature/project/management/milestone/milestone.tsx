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
import { MilestoneForm } from "./milestone-form";
import { EmptyMilestones } from "./empty-milestones";
import { Flag, PlusCircle, Search } from "lucide-react";
import type { Project } from "@/feature/shared/@types/projects";
import { useState } from "react";
import { useMilestone } from "@/feature/shared/hooks/use-milestone";
import { MilestoneItem } from "./milestone-item";
import { Milestone } from "@/feature/shared/@types/milestone";

interface MilestoneViewProps {
  project: Project;
}

export function MilestoneView({ project }: MilestoneViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const { milestones, create, update } = useMilestone({
    projectId: project.id,
  });

  const filteredMilestones =
    milestones?.filter((milestone) =>
      milestone.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          <Flag className="h-5 w-5 text-primary" />
          Milestones for {project.name}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Manage milestones to track project progress and important deadlines.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Search and Create Section */}
        <Card className="p-4 shadow-none transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search milestones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 max-w-md bg-background/50 hover:bg-accent/5 transition-all duration-200 focus:bg-background h-9"
              />
            </div>
            <Button variant="outline">
              {" "}
              ({milestones?.length || 0}) Milestones
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 h-9"
              onClick={() => setIsCreating(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Milestone
            </Button>
          </div>
        </Card>

        {/* Milestones List (Cards) */}
        {filteredMilestones.length > 0 ? (
          <div className=" flex flex-col gap-4">
            {filteredMilestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                onClick={setEditingMilestone}
              />
            ))}
          </div>
        ) : (
          <EmptyMilestones onCreateClick={() => setIsCreating(true)} />
        )}
      </div>

      {/* Create Milestone Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[425px]">
          <MilestoneForm
            onClose={() => setIsCreating(false)}
            onSave={async (values) => {
              await create.mutateAsync({
                ...values,
                projectId: project.id,
                startDate: values.startDate?.toISOString() || "",
                targetDate: values.targetDate?.toISOString() || "",
              });
              setIsCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Milestone Dialog */}
      <Dialog
        open={!!editingMilestone}
        onOpenChange={() => setEditingMilestone(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          {editingMilestone && (
            <MilestoneForm
              milestone={editingMilestone}
              onClose={() => setEditingMilestone(null)}
              onSave={async (values) => {
                await update.mutateAsync({
                  ...values,
                  id: editingMilestone.id,
                  projectId: editingMilestone.projectId,
                  startDate: values.startDate?.toISOString(),
                  targetDate: values.targetDate?.toISOString(),
                });
                setEditingMilestone(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
