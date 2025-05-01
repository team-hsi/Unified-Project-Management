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

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        // onSendMessage(message, []);
        await sendMessage(message); // Call the sendMessage function from context
        setMessage("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center relative p-4 pt-1 bg-transparent"
    >
      <div className="flex-1 flex gap-2 relative bg-muted">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full bg-background border border-input rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-2"
        />
      </div>
      <button
        type="submit"
        className={cn(
          "rounded-full p-1.5 flex items-center justify-center transition-all",
          !message.trim()
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110 hover:bg-accent"
        )}
        disabled={!message.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
