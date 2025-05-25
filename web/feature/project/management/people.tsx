"use client";
import React from "react";
import { useParams } from "next/navigation";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Card } from "@/feature/shared/ui/card";
import { Input } from "@/feature/shared/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/feature/shared/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { Users, UserPlus, Search, Shield, Edit, Eye } from "lucide-react";
import { useProject } from "@/feature/shared/hooks/use-project";
import { Member } from "@/feature/shared/@types/user";
import { AddProjectMemberDialog } from "./add-project-member-dialog";

export const PeopleView = () => {
  const { projectMembers, isLoadingPm, errorPm } = useProject();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team Members
        </DialogTitle>
        <DialogDescription>
          Manage team members and their permissions.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        {/* Search and Invite Section */}
        <Card className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-9 bg-background hover:bg-accent/5 transition-colors duration-200"
              />
            </div>
            <AddProjectMemberDialog projectId={projectId}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite People
              </Button>
            </AddProjectMemberDialog>
          </div>
        </Card>

        {/* Team Members List */}
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="divide-y divide-border">
            {isLoadingPm && (
              <div className="p-8 text-center text-muted-foreground text-lg">
                Loading team members…
              </div>
            )}
            {errorPm && (
              <div className="p-8 text-center text-destructive text-lg">
                <div className="mb-2">⚠️ Failed to load members</div>
                <div className="text-sm">Please try refreshing the page.</div>
              </div>
            )}
            {!isLoadingPm &&
              !errorPm &&
              (!projectMembers?.members ||
                projectMembers.members.length === 0) && (
                <div className="p-8 text-center text-muted-foreground text-lg">
                  <div className="mb-2">No team members yet</div>
                  <div className="text-sm">
                    Invite people to collaborate on this project.
                  </div>
                </div>
              )}
            {projectMembers?.members?.map((member: Member) => (
              <div
                key={member.id}
                className="p-4 hover:bg-accent/5 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.user.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{member.user.username}</h4>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize">
                          {String(member.role)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <Select defaultValue={String(member.role)}>
                    <SelectTrigger className="w-[120px] bg-background hover:bg-accent/5">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="admin"
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </SelectItem>
                      <SelectItem
                        value="editor"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editor
                      </SelectItem>
                      <SelectItem
                        value="viewer"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Viewer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Role Descriptions */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium mb-4">Role Descriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Admin</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all project settings and content.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Editor</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Can create and edit content, but cannot modify project settings.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Viewer</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Can view content but cannot make any changes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
