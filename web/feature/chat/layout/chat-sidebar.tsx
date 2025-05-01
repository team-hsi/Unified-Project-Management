"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRoom } from "@/hooks/use-room";
import { NewChat } from "../actions/new-chat";
import { ChatList } from "../components/chat-list";
import { ChatListLoading } from "../shared/chat-loadings";

export function ChatSidebar() {
  const { error } = useRoom();
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return <div className="p-4">Error loading rooms</div>;
  }

  return (
    <div className="w-72 h-full flex flex-col bg-sidebar-background border-r overflow-hidden">
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

      <React.Suspense fallback={<ChatListLoading />}>
        <ChatList />
      </React.Suspense>
    </div>
  );
}
