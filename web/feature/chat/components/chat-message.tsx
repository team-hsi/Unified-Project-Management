"use client";

import { ChatMessageList } from "@/feature/shared/ui/chat-message-list";
import { useChat } from "@/lib/stores/chat-provider";
import { useUser } from "@/lib/auth/auth-provider";
import { EmptyChat } from "../shared/empty-chat";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { LoaderCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ChatMessages() {
  const { chat, isLoading } = useChat();
  const { session } = useUser();
  console.log("chat", chat);

  if (isLoading) {
    return (
      <div className="h-full w-full items-center flex justify-center flex-1 overflow-hidden p-4">
        <div className=" w-fit p-2 bg-background/30 rounded-lg">
          <LoaderCircle size={40} className=" animate-spin opacity-85" />
        </div>
      </div>
    );
  }

  if (!chat || chat.messages.length === 0) {
    return <EmptyChat />;
  }

  // Sort messages by createdAt in descending order (newest first)
  const sortedMessages = [...chat.messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="h-full flex-1 overflow-hidden flex flex-col">
      <ChatMessageList>
        {sortedMessages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.senderId === session?.userId ? "sent" : "received"}
            className="items-start"
          >
            {message.senderId !== session?.userId && (
              <ChatBubbleAvatar
                className="h-6 w-6 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="Av"
              />
            )}
            <ChatBubbleMessage
              isLoading={isLoading}
              variant={
                message.senderId === session?.userId ? "sent" : "received"
              }
            >
              <div className="flex flex-col gap-1.5 max-w-xs">
                <div className="text-sm text-foreground break-words">
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground/80">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </div>
              </div>
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </ChatMessageList>
    </div>
  );
}
