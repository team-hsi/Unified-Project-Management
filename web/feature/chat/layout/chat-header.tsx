"use client";
import { Search } from "lucide-react";
import { Badge } from "@/feature/shared/ui/badge";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { useMemo } from "react";
import { Room } from "@/feature/shared/@types/room";
import { useParams } from "next/navigation";
import { useMember } from "@/feature/shared/hooks/use-member";
import { ChatDetails } from "../components/info/chat-details";
import { ChatDropdown } from "../interactions/chat-dropdown";

export function ChatHeader() {
  const { chatId } = useParams<{ chatId: string }>();
  const { chatMembers } = useMember();
  const { rooms } = useRoom();
  const activeChat = useMemo(() => {
    const room = rooms.find((r: Room) => r.id === chatId);
    return room?.name || "Select a Chat";
  }, [chatId, rooms]);

  return (
    <div className="border-b border-chat-border bg-chat-header p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <ChatDetails>
          <div className="flex items-center">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>{activeChat.substring(0, 2) || "AT"}</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold flex items-center">
                {activeChat}
                <Badge
                  variant="default"
                  size="sm"
                  className="ml-2 bg-chat-message-sent"
                >
                  Active
                </Badge>
              </h1>
              <div className="flex items-center">
                <Badge
                  variant="online"
                  size="sm"
                  className="mr-1.5 h-2 w-2 rounded-full p-0"
                />
                <span className="text-xs text-muted-foreground">
                  {chatMembers?.length} members
                </span>
              </div>
            </div>
          </div>
        </ChatDetails>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:bg-chat-message-received/30 rounded-full transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:bg-chat-message-received/30 rounded-full transition-colors ml-1"></button>
          <ChatDropdown />
        </div>
      </div>
    </div>
  );
}
