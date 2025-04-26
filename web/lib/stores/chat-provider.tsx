"use client";

import { type ReactNode, createContext, useContext } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../query-client/get-query-client";

// --- Types
type ChatContextType = {
  messages: Message[] | undefined;
  isLoading: boolean;
  sendMessageToChat: (content: string) => Promise<void>;
  selectedChatId: string | null;
  selectChat: (id: string) => void;
};

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar: string;
  mentions: string[];
}

const ChatStoreContext = createContext<ChatContextType | undefined>(undefined);

export const ChatStoreProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const { selectedChatId, selectChat } = useChatStore();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", selectedChatId],
    queryFn: () => {
      if (!selectedChatId) return Promise.resolve([]);
      return getMessages(selectedChatId);
    },
    enabled: !!selectedChatId, // only fetch if a chat is selected
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedChatId) throw new Error("No chat selected");
      return sendMessage(selectedChatId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChatId] });
    },
  });

  const sendMessageToChat = async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
  };

  return (
    <ChatStoreContext.Provider
      value={{
        messages,
        isLoading,
        sendMessageToChat,
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

// --- Mocked API functions for now:

export const getMessages = async (chatId: string) => {
  return new Promise<Message[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          content: "Hi team, how's the progress on the Capstone project?",
          sender: "Sarah Miller",
          timestamp: "10:24 AM",
          isCurrentUser: false,
          avatar: "SM",
          mentions: [],
        },
        {
          id: "2",
          content: "We are on track to finish the project by the deadline.",
          sender: "You",
          timestamp: "10:24 AM",
          isCurrentUser: false,
          avatar: "SM",
          mentions: [],
        },
      ]);
    }, 800); // simulate 800ms network delay
  });
};

export const sendMessage = async (chatId: string, content: string) => {
  return new Promise<Message>((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        content,
        sender: "You", // Assuming 'You' represents the current user
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Use timestamp and format it
        isCurrentUser: true, // Mark as current user
        avatar: "U", // Placeholder avatar
        mentions: [], // Default mentions
      });
    }, 400); // simulate 400ms delay for sending
  });
};
