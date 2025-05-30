import React, { useMemo } from "react";
import { useParams } from "next/navigation";
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
import { Member } from "@/feature/shared/@types/user";
import { Input } from "@/feature/shared/ui/input";
import { Checkbox } from "@/feature/shared/ui/checkbox";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";

interface AddMemberDialogProps {
  children: React.ReactNode;
}

interface SelectedMember {
  userId: string;
  role: "admin" | "member" | "guest";
}

export const AddMemberDialog = ({ children }: AddMemberDialogProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  const { workspaceMembers, isLoadingWsMembers } = useWorkspace();
  const { addMember, roomMembers } = useRoom();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<
    SelectedMember[]
  >([]);

  // Filter workspace members to show only those not already in the room
  const roomMemberIds = useMemo(
    () => new Set(roomMembers?.members?.map((m) => m.user.id)),
    [roomMembers]
  );

  const availableMembers = useMemo(() => {
    if (!workspaceMembers?.members) return [];
    return workspaceMembers.members.filter(
      (member: Member) => !roomMemberIds.has(member.user.id)
    );
  }, [workspaceMembers, roomMemberIds]);

  const filteredMembers = useMemo(() => {
    return availableMembers.filter((member: Member) => {
      const fullName =
        `${member.user.firstname} ${member.user.lastname}`.toLowerCase();
      const email = member.user.email.toLowerCase();
      const search = searchQuery.toLowerCase();
      return fullName.includes(search) || email.includes(search);
    });
  }, [availableMembers, searchQuery]);

  const onSubmit = async () => {
    if (!chatId) return;

    try {
      await Promise.all(
        selectedMembers.map(({ userId, role }) =>
          addMember.mutateAsync({ userId, role, id: chatId })
        )
      );

      toast.success("Members invited successfully!");
      setOpen(false);
      setSelectedMembers([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to invite members"
      );
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isMemberSelected = (userId: string) => {
    return selectedMembers.some((member) => member.userId === userId);
  };

  const getMemberRole = (userId: string) => {
    return (
      selectedMembers.find((member) => member.userId === userId)?.role ||
      "member"
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            {selectedMembers.length === 0
              ? "Select workspace members to invite"
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
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                <AnimatePresence mode="popLayout">
                  {selectedMembers.map(({ userId }) => {
                    const member = availableMembers.find(
                      (m: Member) => m.user.id === userId
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
                <Input
                  placeholder={
                    selectedMembers.length === 0
                      ? "Search members..."
                      : "Add by search..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px]"
                />
              </div>
              <ScrollArea className="h-[300px] rounded-md p-2">
                {isLoadingWsMembers ? (
                  <div className="flex items-center justify-center p-4 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading
                    workspace members...
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No workspace members available to invite
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMembers.map((member: Member) => (
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
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMembers([
                                ...selectedMembers,
                                { userId: member.user.id, role: "member" },
                              ]);
                            } else {
                              setSelectedMembers(
                                selectedMembers.filter(
                                  (m) => m.userId !== member.user.id
                                )
                              );
                            }
                          }}
                        />
                        <Avatar className="h-8 w-8">
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
                        {isMemberSelected(member.user.id) && (
                          <Select
                            value={getMemberRole(member.user.id)}
                            onValueChange={(role) => {
                              setSelectedMembers(
                                selectedMembers.map((m) =>
                                  m.userId === member.user.id
                                    ? {
                                        ...m,
                                        role: role as
                                          | "admin"
                                          | "member"
                                          | "guest",
                                      }
                                    : m
                                )
                              );
                            }}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
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
            </div>

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
                      className="rounded-full size-8"
                      disabled={addMember.isPending}
                    >
                      {addMember.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="size-8" />
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
