"use client";
import { Search, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRoom } from "@/hooks/use-room";
import { useChat } from "@/lib/stores/chat-provider";
import { useMemo } from "react";
import { Room } from "@/@types/room";

export function ChatHeader() {
  const { selectedChatId } = useChat();
  const { rooms } = useRoom();
  const activeChat = useMemo(() => {
    const room = rooms.find((r: Room) => r.id === selectedChatId);
    return room?.name || "Select a Chat";
  }, [selectedChatId, rooms]);

  return (
    <div className="border-b border-chat-border bg-chat-header p-2 shadow-sm">
      <div className="flex items-center justify-between">
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
                5 members online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:bg-chat-message-received/30 rounded-full transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:bg-chat-message-received/30 rounded-full transition-colors ml-1">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
