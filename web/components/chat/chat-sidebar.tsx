"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewRoom } from "./new-room";
import { useRoom } from "@/hooks/use-room";
// import { Room } from "@/@types/room";
import { useChat } from "@/lib/stores/chat-provider";

export function ChatSidebar() {
  const { rooms, isPending, isFetching, isError, error } = useRoom();
  console.log("rooms", rooms);
  const { selectedChatId, selectChat } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  // let filteredContacts: Room[] = [];

  // if (!isLoading && rooms.length > 0) {
  //   filteredContacts = rooms.filter((room: Room) =>
  //     room.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }
  if (error) {
    return <div className="p-4">Error loading rooms</div>;
  }
  if (isPending) {
    return <div className="p-4">Loading rooms...</div>;
  }
  console.log("isPending", isPending);
  console.log("isFetching", isFetching);
  console.log("isError", isError);

  return (
    <div className="w-72 border-r border-chat-border h-full flex flex-col bg-sidebar-background">
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <NewRoom />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input rounded-md py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
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
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white"
                  )}
                >
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
      </div>
    </div>
  );
}
