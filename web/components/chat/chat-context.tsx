"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Contact {
  id: number;
  name: string;
  avatar: string;
  type: "project" | "direct";
  status?: "online" | "offline" | "away";
}

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar: string;
  mentions: string[];
}

interface ChatContextType {
  messages: Message[];
  contacts: Contact[];
  activeChat: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setActiveChat: (chat: string) => void;
  sendMessage: (content: string, mentions?: string[]) => void;
}

const defaultContext: ChatContextType = {
  messages: [],
  contacts: [],
  activeChat: "Capstone Team",
  isLoading: false,
  setIsLoading: () => {},
  setActiveChat: () => {},
  sendMessage: () => {},
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [contacts] = useState<Contact[]>([
    { id: 1, name: "Capstone Team", avatar: "CT", type: "project" },
    { id: 2, name: "Design Team", avatar: "DT", type: "project" },
    { id: 3, name: "Marketing Project", avatar: "MP", type: "project" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi team, how's the progress on the Capstone project?",
      sender: "Sarah Miller",
      timestamp: "10:24 AM",
      isCurrentUser: false,
      avatar: "SM",
      mentions: [],
    },
    {
      id: 2,
      content:
        "We've completed the UI design and started on the backend implementation.",
      sender: "You",
      timestamp: "10:26 AM",
      isCurrentUser: true,
      avatar: "N",
      mentions: [],
    },
    {
      id: 3,
      content:
        "Great! I've just pushed some updates to the documentation. Can everyone review it by tomorrow?",
      sender: "Alex Johnson",
      timestamp: "10:30 AM",
      isCurrentUser: false,
      avatar: "AJ",
      mentions: [],
    },
    {
      id: 4,
      content:
        "Sure, I'll take a look after I finish the current feature I'm working on.",
      sender: "You",
      timestamp: "10:32 AM",
      isCurrentUser: true,
      avatar: "N",
      mentions: [],
    },
  ]);

  const [activeChat, setActiveChat] = useState("Capstone Team");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const sendMessage = (content: string, mentions: string[] = []) => {
    if (!content.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
      avatar: "N",
      mentions,
    };

    setMessages([...messages, newMessage]);

    // Simulate a response after a short delay (for demo purposes)
    if (activeChat === "Capstone Team") {
      setTimeout(() => {
        const responseMessage = {
          id: messages.length + 2,
          content:
            "Thanks for the update! Let's discuss this more in the next meeting.",
          sender: "Sarah Miller",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser: false,
          avatar: "SM",
          mentions: [],
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 3000);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        contacts,
        activeChat,
        setActiveChat,
        sendMessage,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
