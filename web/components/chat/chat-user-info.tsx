import React from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChatSheetHeader } from "./chat-sheet-header";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Member } from "@/@types/user";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useMember } from "@/hooks/use-member";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ChatUserInfoProps {
  member: Member;
  onClose: () => void;
}
// TODO: add joined date to the member
export const ChatUserInfo = ({ member, onClose }: ChatUserInfoProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  const { removeChatMember } = useMember();

  const handleRemoveMember = async () => {
    try {
      await removeChatMember.mutateAsync({
        id: chatId,
        userId: member.user.id,
      });
      toast.success(`Member removed successfully, ${member.user.id}`);
      onClose();
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatSheetHeader title="User Info" onClose={onClose} />
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar className="w-24 h-24 bg-muted-foreground rounded-full flex items-center justify-center">
            <AvatarFallback className="text-2xl">
              {`${member.user.firstname.charAt(0)}${member.user.lastname.charAt(
                0
              )}`}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {member.user.firstname} {member.user.lastname}
            </h2>
            <p className="text-muted-foreground">{member.user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{member.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">
                {new Date(member.user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleRemoveMember}
            // disabled={removeChatMember.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove from Room
          </Button>
        </div>
      </div>
    </div>
  );
};
