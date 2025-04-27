"use client";

import { type ReactNode, createContext, useContext } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../query-client/get-query-client";
import { getRoomMessages } from "@/actions/room-actions";
import { sendMessage as sendMsg } from "@/actions/message-actions";
import { toast } from "sonner";
import { Message } from "@/@types/message";
import { useUser } from "../auth/auth-provider";

// --- Types
type ChatContextType = {
  messages: Message[] | [];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  selectedChatId: string | null;
  selectChat: (id: string | null) => void;
};

const ChatStoreContext = createContext<ChatContextType | undefined>(undefined);

export const ChatStoreProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const { selectedChatId, selectChat } = useChatStore();
  const { user } = useUser();

  const { data: messages, isLoading } = useQuery({
    queryKey: [selectedChatId, "messages"],
    queryFn: () => {
      if (!selectedChatId) return Promise.resolve([]);
      return getRoomMessages({ id: selectedChatId });
    },
    enabled: !!selectedChatId, // only fetch if a chat is selected
  });

  const sendAction = useMutation({
    mutationFn: (content: string) => {
      if (!selectedChatId) throw new Error("No chat selected");
      return sendMsg({ roomId: selectedChatId, content });
    },
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({
        queryKey: [selectedChatId, "messages"],
      });
      const previousMessages = queryClient.getQueryData([
        selectedChatId,
        "messages",
      ]);

      // Optimistically update the message list by adding the new message
      queryClient.setQueryData(
        [selectedChatId, "messages"],
        (oldMessages: Message[] | []) => {
          return [
            ...oldMessages,
            {
              id: "temp-id", // Temporary ID before server response
              content,
              roomId: selectedChatId,
              senderId: user?.id, // You can replace this with actual user data
              createdAt: new Date().toISOString(),
            },
          ];
        }
      );
      // Return a rollback function in case of error
      return { previousMessages };
    },
    onError: (error, content, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [selectedChatId, "messages"],
          context.previousMessages
        );
      }
      toast.error(JSON.stringify(error));
      toast.error("Failed to send message. Please try again later.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [selectedChatId, "messages"] });
      toast.success("Message sent successfully!");
    },
  });

  const sendMessage = async (content: string) => {
    await sendAction.mutateAsync(content);
  };

  return (
    <ChatStoreContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        selectedChatId,
        selectChat,
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
