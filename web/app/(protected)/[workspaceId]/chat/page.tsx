import { Chat } from "@/components/chat/chat";
import React from "react";
import { ChatProvider } from "@/components/chat/chat-context";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chat",
  description: "Collaboration chat page",
};
const page = () => {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
};

export default page;
