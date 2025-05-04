import { ChatInput } from "@/feature/chat/components/chat-input";
import { ChatMessages } from "@/feature/chat/components/chat-message";
import { ChatHeader } from "@/feature/chat/layout/chat-header";
import { ChatHeaderLoading } from "@/feature/chat/shared/chat-loadings";
import * as React from "react";

const ChatPage = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <React.Suspense fallback={<ChatHeaderLoading />}>
        <ChatHeader />
      </React.Suspense>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatPage;
