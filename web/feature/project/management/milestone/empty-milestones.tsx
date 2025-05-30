"use client";
import { Button } from "@/feature/shared/ui/button";
import { Card } from "@/feature/shared/ui/card";
import { Flag } from "lucide-react";

interface EmptyMilestonesProps {
  onCreateClick: () => void;
}

export function EmptyMilestones({ onCreateClick }: EmptyMilestonesProps) {
  return (
    <Card className="p-8 shadow-none transition-all duration-300">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Flag className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Milestones Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first milestone to start tracking project progress and
            important deadlines.
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
        >
          Create Milestone
        </Button>
      </div>
    </Card>
  );
}
