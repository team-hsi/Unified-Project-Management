"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/components/chat/chat-context";
import { NewRoom } from "./new-room";

export function ChatSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { activeChat, setActiveChat, contacts } = useChat();

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 border-r border-chat-border h-full flex flex-col bg-sidebar-background">
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <NewRoom />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input rounded-md py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              "p-3 border-b border-chat-border hover:bg-sidebar-accent cursor-pointer transition-colors",
              contact.name === activeChat ? "bg-sidebar-accent" : ""
            )}
            onClick={() => setActiveChat(contact.name)}
          >
            <div className="flex items-start">
              <div className="relative">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white",
                    contact.id === 1
                      ? "bg-blue-500"
                      : contact.id === 2
                      ? "bg-green-500"
                      : contact.id === 3
                      ? "bg-purple-500"
                      : contact.id === 4
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  )}
                >
                  <span>{contact.avatar}</span>
                </div>
                {contact.id == 2 && (
                  <div className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-sidebar-background"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    10:30 AM
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Alex: I&apos;ve just pushed some updates to the documentation
                </p>
              </div>
              {contact.id - 1 > 0 && (
                <div className="ml-2 bg-chat-message-sent rounded-full h-5 w-5 flex items-center justify-center">
                  <span className="text-white text-xs">{contact.id - 1}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
