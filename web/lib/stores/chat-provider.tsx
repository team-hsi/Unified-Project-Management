"use client";

import { type ReactNode, createContext, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../query-client/get-query-client";
import { toast } from "sonner";
import { useUser } from "../auth/auth-provider";
import { Chat } from "@/feature/shared/@types/room";
import { useParams } from "next/navigation";
import { createMessage } from "@/actions/api/message/mutations";
import { getRoomMessages } from "@/actions/api/message/queries";
import { useUtils } from "@/feature/shared/hooks/use-utils";
import { BaseError } from "../errors";

// --- Types
type ChatContextType = {
  chat: Chat;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
};

const ChatStoreContext = createContext<ChatContextType | undefined>(undefined);

export const ChatStoreProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useUser();
  const { isValidResponse, toastUnknownError } = useUtils();

  const { data: chat, isLoading } = useQuery({
    queryKey: [chatId, "chat"],
    queryFn: () => getRoomMessages({ id: chatId }),
    enabled: !!chatId,
  });

  const sendAction = useMutation({
    mutationFn: createMessage,
    onMutate: async ({ roomId, content }) => {
      await queryClient.cancelQueries({
        queryKey: [roomId, "chat"],
      });
      const previousMessages = queryClient.getQueryData([roomId, "chat"]);

      // Optimistically update the message list by adding the new message
      queryClient.setQueryData(
        [roomId, "chat"],
        (oldChat: Chat | undefined) => {
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
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [chatId, "chat"] });
      if (isValidResponse(response)) {
        toast.success("Message sent successfully!");
      }
    },
  });

  const sendMessage = async (content: string) => {
    await sendAction.mutateAsync({ roomId: chatId, content });
  };

  return (
    <ChatStoreContext.Provider
      value={{
        chat: chat as Chat,
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
