"use client";

import { type ReactNode, createContext, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../query-client/get-query-client";
import { getRoomMessages } from "@/actions/room-actions";
import { sendMessage as sendMsg } from "@/actions/message-actions";
import { toast } from "sonner";
import { useUser } from "../auth/auth-provider";
import { TChat } from "@/@types/room";
import { useParams } from "next/navigation";

// --- Types
type ChatContextType = {
  chat: TChat;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
};

const ChatStoreContext = createContext<ChatContextType | undefined>(undefined);

export const ChatStoreProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useUser();

  const { data: chat, isLoading } = useQuery({
    queryKey: [chatId, "chat"],
    queryFn: () => {
      if (!chatId) return Promise.resolve([]);
      return getRoomMessages({ id: chatId });
    },
    enabled: !!chatId, // only fetch if a chat is selected
  });

  const sendAction = useMutation({
    mutationFn: sendMsg,
    onMutate: async ({ roomId, content }) => {
      await queryClient.cancelQueries({
        queryKey: [roomId, "chat"],
      });
      const previousMessages = queryClient.getQueryData([roomId, "chat"]);

      // Optimistically update the message list by adding the new message
      queryClient.setQueryData(
        [roomId, "chat"],
        (oldChat: TChat | undefined) => {
          console.log("oldchat=>", oldChat);
          return {
            ...oldChat,
            messages: [
              ...(oldChat?.messages || []),
              {
                id: `temp-${Math.random().toString(36).substring(2, 9)}`,
                content: content,
                roomId: roomId,
                senderId: user?.id,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
      );
      // Return a rollback function in case of error
      return { previousMessages };
    },
    onError: (error, content, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData([chatId, "chat"], context.previousMessages);
      }
      toast.error(JSON.stringify(error));
      toast.error("Failed to send message. Please try again later.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatId, "chat"] });
      toast.success("Message sent successfully!");
    },
  });

  const sendMessage = async (content: string) => {
    await sendAction.mutateAsync({ roomId: chatId, content });
  };

  return (
    <ChatStoreContext.Provider
      value={{
        chat,
        isLoading,
        sendMessage,
      }}
    >
      {children}
    </ChatStoreContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error("useChat must be used inside ChatStoreProvider");
  }
  return context;
};
