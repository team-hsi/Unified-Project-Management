import React from "react";
import { Metadata } from "next";
import { ChatStoreProvider } from "@/lib/stores/chat-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Chat } from "@/feature/chat/layout/chat";
import { getUserRooms } from "@/actions/api/room/queries";
import { verifySession } from "@/actions/core/dal";
export const metadata: Metadata = {
  title: "Chat",
  description: "Collaboration chat page",
};

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [session.userId, "rooms"],
    queryFn: () => getUserRooms(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatStoreProvider>
        <Chat>{children}</Chat>
      </ChatStoreProvider>
    </HydrationBoundary>
  );
};

export default ChatLayout;
