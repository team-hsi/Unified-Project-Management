"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { NewChat } from "./new-chat";
import { ChatList } from "./chat-list"; // <--- import the new component
import { useRoom } from "@/hooks/use-room";
import { ChatListLoading } from "./chat-loadings";

export function ChatSidebar() {
  const { error } = useRoom();
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return <div className="p-4">Error loading rooms</div>;
  }

  return (
    <div className="w-72 border-r border-chat-border h-full flex flex-col bg-sidebar-background">
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <NewChat />
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
        <React.Suspense fallback={<ChatListLoading />}>
          <ChatList />
        </React.Suspense>
      </div>
    </div>
  );
}
