"use client";
// import { useRef, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { useChat } from "./chat-context";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar: string;
  mentions: string[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="h-full flex-1 overflow-hidden">
      <ChatMessageList>
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.sender === "You" ? "sent" : "received"}
          >
            <ChatBubbleAvatar
              className="h-8 w-8 shrink-0"
              src={
                message.sender === "You"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                  : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
              }
              fallback={message.sender === "You" ? "US" : "AI"}
            />
            <ChatBubbleMessage
              variant={message.sender === "You" ? "sent" : "received"}
            >
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}

        {isLoading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              className="h-8 w-8 shrink-0"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
              fallback="AI"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
}
