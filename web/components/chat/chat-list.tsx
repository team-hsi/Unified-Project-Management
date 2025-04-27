"use client";

import { useRoom } from "@/hooks/use-room";
import { useChat } from "@/lib/stores/chat-provider";
import { Room } from "@/@types/room";
import { cn } from "@/lib/utils";

export const ChatList = () => {
  const { rooms } = useRoom();
  const { selectedChatId, selectChat } = useChat();

  if (!rooms.length) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        No rooms available.
      </div>
    );
  }

  return (
    <>
      {rooms.map((room: Room) => (
        <div
          key={room.id}
          className={cn(
            "p-3 border-b border-chat-border hover:bg-sidebar-accent cursor-pointer transition-colors",
            room.id === selectedChatId ? "bg-sidebar-accent" : ""
          )}
          onClick={() => selectChat(room.id)}
        >
          <div className="flex items-start">
            <div className="relative">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-primary">
                <span>{room.name.slice(0, 2)}</span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm truncate">{room.name}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  10:30 AM
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Alex: I&apos;ve just pushed some updates to the documentation
              </p>
            </div>
            <div className="ml-2 bg-chat-message-sent rounded-full h-5 w-5 flex items-center justify-center">
              <span className="text-white text-xs">1</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
