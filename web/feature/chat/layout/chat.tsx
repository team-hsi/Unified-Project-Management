"use client";

import * as React from "react";
import { ChatSidebar } from "@/feature/chat/layout/chat-sidebar";
import { useEventListener } from "usehooks-ts";
import { useRouter } from "next/navigation";
export const Chat = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      router.back();
    }
  });
  return (
    <div className="flex h-full bg-background overflow-hidden">
      <ChatSidebar />
      {children}
    </div>
  );
};
