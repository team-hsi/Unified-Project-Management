import React, { useState } from "react";
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
import { Checkbox } from "@/feature/shared/ui/checkbox";
// import { useProject } from "@/feature/shared/hooks/use-project";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";

interface AddItemAssigneeDialogProps {
  children: React.ReactNode;
  itemId: string;
  projectId: string;
  onAssign: (userId: string) => Promise<void>;
}

export const AddItemAssigneeDialog = ({
  children,
  itemId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectId,
  onAssign,
}: AddItemAssigneeDialogProps) => {
  // const { projectMembers } = useProject();
  const { workspaceMembers } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!itemId || selectedMembers.length === 0) return;

    setIsLoading(true);
    try {
      const userId = selectedMembers[selectedMembers.length - 1];
      if (userId) {
        await onAssign(userId);
      } else {
        toast.error("No member selected.");
      }
      // await Promise.all(
      //   selectedMembers.map(async (userId, index) => {
      //     console.log(`Starting assignment ${index}`);
      //     await onAssign(userId);
      //     console.log(`Completed assignment ${index}`);
      //   })
      // );

      toast.success("Assignees added successfully!");
      setOpen(false);
      setSelectedMembers([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add assignees"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  const isMemberSelected = (userId: string) => {
    return selectedMembers.includes(userId);
  };

  const handleCheckboxChange = (checked: boolean, memberId: string) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item Assignee</DialogTitle>
          <DialogDescription>
            {selectedMembers.length === 0
              ? "Select project members to assign to this item"
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
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
              <AnimatePresence mode="popLayout">
                {selectedMembers.map((userId) => {
                  const member = workspaceMembers?.members?.find(
                    (m) => m.user.id === userId
                  );
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
                            selectedMembers.filter((id) => id !== userId)
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
            </div>

            <ScrollArea className="h-[300px] rounded-md p-2 border">
              {!workspaceMembers?.members ? (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading
                  project members...
                </div>
              ) : workspaceMembers.members.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No project members available to assign.
                </div>
              ) : (
                <div className="space-y-2">
                  {workspaceMembers.members.map((member) => (
                    <motion.div
                      key={member.user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <Checkbox
                        id={member.user.id}
                        checked={isMemberSelected(member.user.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            checked as boolean,
                            member.user.id
                          )
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
                          htmlFor={member.user.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {`${member.user.firstname} ${member.user.lastname}`}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      </div>
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
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
