"use client";

import * as React from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useEventListener } from "usehooks-ts";
import { useChat } from "@/lib/stores/chat-provider";
import { ChatHeaderLoading } from "./chat-loadings";

export const Chat = () => {
  const { selectChat, selectedChatId } = useChat();
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      selectChat(null);
    }
  });
  return (
    <div className="flex h-full bg-background overflow-hidden">
      <ChatSidebar />
      {selectedChatId && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <React.Suspense fallback={<ChatHeaderLoading />}>
            <ChatHeader />
          </React.Suspense>
          <div className="flex-1 overflow-y-auto  bg-chat-bg">
            <ChatMessages />
          </div>
          <ChatInput />
        </div>
      )}
    </div>
  );
};
