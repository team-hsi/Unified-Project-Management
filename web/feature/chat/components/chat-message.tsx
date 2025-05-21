"use client";

import { ChatMessageList } from "@/feature/shared/ui/chat-message-list";
import { useChat } from "@/lib/stores/chat-provider";
import { useUser } from "@/lib/auth/auth-provider";
import { EmptyChat } from "../shared/empty-chat";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { Skeleton } from "@/feature/shared/ui/skeleton";

const MessageSkeleton = () => (
  <div className="flex items-start gap-3 mb-4">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-3/4" />
    </div>
  </div>
);

export function ChatMessages() {
  const { chat, isLoading } = useChat();
  const { session } = useUser();

  if (isLoading) {
    return (
      <div className="h-full flex-1 overflow-hidden p-4">
        <div className="space-y-6">
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </div>
      </div>
    );
  }

  if (!chat || chat.messages.length === 0) {
    return <EmptyChat />;
  }

  // Sort messages by createdAt in ascending order (oldest first)
  const sortedMessages = [...chat.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="h-full flex-1 overflow-hidden flex flex-col-reverse">
      <ChatMessageList>
        {sortedMessages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.senderId === session?.userId ? "sent" : "received"}
          >
            {message.senderId !== session?.userId && (
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="Av"
              />
            )}
            <ChatBubbleMessage
              variant={
                message.senderId === session?.userId ? "sent" : "received"
              }
            >
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </ChatMessageList>
    </div>
  );
}
