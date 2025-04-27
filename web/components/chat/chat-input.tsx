"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/stores/chat-provider";

export function ChatInput() {
  const { sendMessage } = useChat(); // Assuming you have a sendMessage function in your context
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // onSendMessage(message, []);
      await sendMessage(message); // Call the sendMessage function from context
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        // onSendMessage(message, []);
        sendMessage(message); // Call the sendMessage function from context
        setMessage("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
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
