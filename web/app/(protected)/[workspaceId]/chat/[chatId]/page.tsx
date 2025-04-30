import * as React from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";

import { ChatHeaderLoading } from "@/components/chat/chat-loadings";

const ChatPage = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <React.Suspense fallback={<ChatHeaderLoading />}>
        <ChatHeader />
      </React.Suspense>
      <div className="flex-1 overflow-y-auto  bg-chat-bg">
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatPage;
