"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Label } from "@/feature/shared/ui/label";
import { Textarea } from "@/feature/shared/ui/textarea";
import { Save } from "lucide-react";
import type { Project } from "@/@types/projects";

export function GeneralView({ project }: { project: Project }) {
  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">
          General Settings
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Manage general settings for {project.name}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground">Project avatar</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Change
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              defaultValue={project.name}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description..."
              className="mt-1.5 resize-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-base font-medium mb-4">Danger Zone</h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-red-800 mb-1">
              Delete this project
            </h4>
            <p className="text-sm text-red-600 mb-3">
              Once you delete a project, there is no going back. Please be
              certain.
            </p>
            <Button variant="destructive" size="sm">
              Delete project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
