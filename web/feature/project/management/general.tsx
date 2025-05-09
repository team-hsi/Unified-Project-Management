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
import { Card } from "@/feature/shared/ui/card";
import { Save, Trash2, Settings, Users, Bell, Tag } from "lucide-react";
import type { Project } from "@/feature/shared/@types/projects";

export function GeneralView({ project }: { project: Project }) {
  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          General Settings
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Manage general settings for {project.name}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Project Avatar and Basic Info */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold ring-2 ring-background hover:ring-accent/20 transition-all duration-200">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-lg">{project.name}</h3>
              <p className="text-sm text-muted-foreground">Project avatar</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hover:bg-accent/5"
            >
              Change
            </Button>
          </div>
        </Card>

        {/* Project Details Form */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium mb-4">Project Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name" className="text-sm font-medium">
                Project name
              </Label>
              <Input
                id="project-name"
                defaultValue={project.name}
                className="mt-1.5 bg-background hover:bg-accent/5 transition-colors duration-200"
              />
            </div>

            <div>
              <Label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="project-description"
                placeholder="Enter project description..."
                className="mt-1.5 resize-none bg-background hover:bg-accent/5 transition-colors duration-200"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="hover:bg-accent/5">
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:bg-accent/5 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Team Members</h4>
                <p className="text-sm text-muted-foreground">
                  Manage project team
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:bg-accent/5 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Configure alerts
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:bg-accent/5 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Labels</h4>
                <p className="text-sm text-muted-foreground">
                  Manage project labels
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="p-6 bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h3>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-destructive mb-1">
              Delete this project
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Once you delete a project, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete project
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
