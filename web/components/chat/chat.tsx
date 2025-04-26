// "use client";

// import { useChat } from "@/components/chat/chat-context";
import { ChatHeader } from "@/components/chat/chat-header";
// import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import React, { Suspense } from "react";

export const Chat = () => {
  return (
    <div className="flex h-screen bg-background">
      <Suspense fallback={<div className="p-4">Loading rooms...</div>}>
        <ChatSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
          <ChatMessages />
        </div>
        {/* <ChatInput onSendMessage={handleSendMessage} /> */}
      </div>
    </div>
  );
};
