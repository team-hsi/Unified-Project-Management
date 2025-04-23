"use client";

import { useChat } from "@/components/chat/chat-context";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import React from "react";

export const Chat = () => {
  const { messages, sendMessage, isLoading } = useChat();

  const handleSendMessage = (content: string, mentions: string[] = []) => {
    sendMessage(content, mentions);
  };
  return (
    <>
      {/* <Sidebar /> */}
      <ChatSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
