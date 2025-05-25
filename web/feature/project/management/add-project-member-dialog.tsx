import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/feature/shared/ui/button";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/feature/shared/ui/avatar";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { useProject } from "@/feature/shared/hooks/use-project";
import { Checkbox } from "@/feature/shared/ui/checkbox";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";
import { Member } from "@/feature/shared/@types/user";

interface SelectedMember {
  userId: string;
  role: Member["role"];
}

interface AddProjectMemberDialogProps {
  children: React.ReactNode;
  projectId: string;
}

export const AddProjectMemberDialog = ({
  children,
  projectId,
}: AddProjectMemberDialogProps) => {
  const { projectMembers, addMember } = useProject(); // Get addMember mutation from useProject
  const { workspaceMembers, isLoadingWsMembers } = useWorkspace(); // Get all workspace members

  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);

  // Filter workspace members to show only those not already in the project
  const projectMemberIds = useMemo(
    () => new Set(projectMembers?.members?.map((m) => m.user.id)),
    [projectMembers]
  );

  const availableMembers = useMemo(() => {
    if (!workspaceMembers?.members) return [];
    return workspaceMembers.members.filter(
      (member: Member) => !projectMemberIds.has(member.id)
    );
  }, [workspaceMembers, projectMemberIds]);

  const onSubmit = async () => {
    if (!projectId || selectedMembers.length === 0) return;

    try {
      await Promise.all(
        selectedMembers.map(async ({ userId, role }) => {
          await addMember.mutateAsync({ userId, role, id: projectId });
          return console.log("pr", userId, role, projectId);
        })
      );

      toast.success("Members added successfully!");
      setOpen(false);
      setSelectedMembers([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add members"
      );
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  const isMemberSelected = (userId: string) => {
    return selectedMembers.some((member) => member.userId === userId);
  };

  const getMemberRole = (userId: string): string => {
    return String(
      selectedMembers.find((member) => member.userId === userId)?.role ||
        "member"
    );
  };

  const handleCheckboxChange = (checked: boolean, member: Member) => {
    if (checked) {
      setSelectedMembers([
        ...selectedMembers,
        { userId: member.id, role: "member" },
      ]); // Default to viewer role
    } else {
      setSelectedMembers(selectedMembers.filter((m) => m.userId !== member.id));
    }
  };

  const handleRoleChange = (userId: string, role: SelectedMember["role"]) => {
    setSelectedMembers(
      selectedMembers.map((m) =>
        m.userId === userId ? { ...m, role: role } : m
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
          <DialogDescription>
            {selectedMembers.length === 0
              ? "Select workspace members to add to the project"
              : `${selectedMembers.length} member${
                  selectedMembers.length > 1 ? "s" : ""
                } selected`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-3 grid gap-3 w-full"
          >
            {/* Selected Members Preview (Optional, can remove if not needed like in chat) */}
            {/* Keeping a simplified version */}
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
              <AnimatePresence mode="popLayout">
                {selectedMembers.map(({ userId }) => {
                  const member = availableMembers.find(
                    (m: Member) => m.id === userId
                  ); // Find from available members list
                  if (!member) return null;

                  return (
                    <motion.div
                      key={userId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <span>
                        {member.user.firstname} {member.user.lastname}
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedMembers(
                            selectedMembers.filter((m) => m.userId !== userId)
                          );
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {/* Search Input (Removed as we are selecting from a list, not searching arbitrary users) */}
            </div>
            {/* End Selected Members Preview */}

            <ScrollArea className="h-[300px] rounded-md p-2 border">
              {isLoadingWsMembers ? (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading
                  workspace members...
                </div>
              ) : availableMembers.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No workspace members available to add to this project.
                </div>
              ) : (
                <div className="space-y-2">
                  {availableMembers.map((member: Member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <Checkbox
                        id={member.id}
                        checked={isMemberSelected(member.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(checked as boolean, member)
                        }
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback>
                          {getInitials(
                            member.user.firstname,
                            member.user.lastname
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <label
                          htmlFor={member.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {`${member.user.firstname} ${member.user.lastname}`}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      </div>
                      {isMemberSelected(member.id) && (
                        <Select
                          value={getMemberRole(member.id)}
                          onValueChange={(role) =>
                            handleRoleChange(
                              member.id,
                              role as SelectedMember["role"]
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px] h-8">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              Project Manager
                            </SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="flex items-center justify-end px-3">
              <AnimatePresence mode="wait">
                {selectedMembers.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <Button
                      type="submit"
                      className="rounded-md px-4 py-2"
                      disabled={addMember.isPending}
                    >
                      {addMember.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Add Selected ({selectedMembers.length})
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-md px-4 py-2"
                    disabled
                  >
                    Add Selected (0)
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
