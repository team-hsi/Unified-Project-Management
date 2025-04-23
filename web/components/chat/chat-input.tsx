"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { Send, Paperclip, Smile, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "./chat-context";

interface ChatInputProps {
  onSendMessage: (content: string, mentions: string[]) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { contacts } = useChat();

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Extract mentions from the message
      const mentions = extractMentions(message);
      onSendMessage(message, mentions);
      setMessage("");
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        const mentions = extractMentions(message);
        onSendMessage(message, mentions);
        setMessage("");
        setShowMentionsList(false);
      }
    } else if (e.key === "@") {
      setShowMentionsList(true);
      setMentionQuery("");
      setCursorPosition(e.currentTarget.selectionStart || 0);
    } else if (showMentionsList && e.key === "Escape") {
      setShowMentionsList(false);
    } else if (showMentionsList && e.key === "ArrowDown") {
      e.preventDefault();
      // Handle arrow down in mentions list
    } else if (showMentionsList && e.key === "ArrowUp") {
      e.preventDefault();
      // Handle arrow up in mentions list
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Check if we're in a mention
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setShowMentionsList(true);
      setMentionQuery(mentionMatch[1]);
      setCursorPosition(cursorPos);
    } else {
      setShowMentionsList(false);
    }
  };

  const insertMention = (contactName: string) => {
    const beforeMention = message.substring(
      0,
      cursorPosition - mentionQuery.length - 1
    );
    const afterMention = message.substring(cursorPosition);
    const newMessage = `${beforeMention}@${contactName} ${afterMention}`;

    setMessage(newMessage);
    setShowMentionsList(false);

    // Focus back on input and place cursor after the inserted mention
    if (inputRef.current) {
      inputRef.current.focus();
      const newCursorPosition = beforeMention.length + contactName.length + 2; // +2 for @ and space
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
        }
      }, 0);
    }
  };

  return (
    <div className="border-t border-chat-border p-4 bg-chat-input-bg">
      <form onSubmit={handleSubmit} className="flex items-center relative">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full bg-background border border-input rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-chat-message-sent"
          />
        </div>
        <button
          type="submit"
          className={cn(
            "bg-chat-message-sent text-white rounded-full p-2.5 flex items-center justify-center transition-all",
            !message.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-chat-message-sent/80"
          )}
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      <div className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift+Enter for new line, @ to mention
      </div>
    </div>
  );
}
