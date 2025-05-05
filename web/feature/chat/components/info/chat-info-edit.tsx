import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import { ChatEditForm } from "./chat-edit-form";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Room } from "@/feature/shared/@types/room";
import { ChatSheetHeader } from "../../layout/chat-sheet-header";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";

interface ChatInfoEditProps {
  onClose: () => void;
  room: Room | undefined;
}

export const ChatInfoEdit = ({ onClose, room }: ChatInfoEditProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  const { update } = useRoom();

  const handleNameUpdate = async (name: string) => {
    try {
      await update.mutateAsync({
        id: chatId,
        name,
      });
      toast.success("Group name updated successfully");
      onClose();
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatSheetHeader title="Edit Chat Info" onClose={onClose} />
      <div className="flex-grow overflow-y-auto">
        <div className="p-6 pt-3 gap-3 flex flex-col items-center">
          <Avatar className="w-20 h-20 bg-muted-foreground rounded-full flex items-center justify-center">
            <AvatarFallback>Av</AvatarFallback>
          </Avatar>
          <CardHeader className="text-center">
            <CardTitle className="">Edit Group Name</CardTitle>
            <CardDescription className="">
              Update your group&apos;s name
            </CardDescription>
          </CardHeader>
        </div>
        <ChatEditForm onSubmit={handleNameUpdate} initialName={room?.name} />
      </div>
    </div>
  );
};
