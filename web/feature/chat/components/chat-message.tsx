"use client";

import { ChatMessageList } from "@/feature/shared/ui/chat-message-list";
import { useChat } from "@/lib/stores/chat-provider";
import { useUser } from "@/lib/auth/auth-provider";
import { EmptyChat } from "../shared/empty-chat";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
export function ChatMessages() {
  const { chat, isLoading } = useChat();
  const { user } = useUser();

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }
  console.log("messages", chat?.messages);

  if (!chat || chat.messages.length === 0) {
    return <EmptyChat />;
  }
  return (
    <div className="h-full flex-1 overflow-hidden">
      <ChatMessageList>
        {chat.messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.senderId === user?.id ? "sent" : "received"}
          >
            {message.senderId !== user?.id && (
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="Av"
              />
            )}
            <ChatBubbleMessage
              variant={message.senderId === user?.id ? "sent" : "received"}
            >
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}

        {/* {isTyping && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              className="h-8 w-8 shrink-0"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
              fallback="AI"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )} */}
      </ChatMessageList>
    </div>
  );
}
