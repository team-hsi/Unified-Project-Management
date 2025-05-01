import React from "react";
import { Metadata } from "next";
import { ChatStoreProvider } from "@/lib/stores/chat-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { getWorkspaceRooms } from "@/feature/shared/actions/workspace-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Chat } from "@/feature/chat/layout/chat";
export const metadata: Metadata = {
  title: "Chat",
  description: "Collaboration chat page",
};

const ChatLayout = async ({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [workspaceId, "rooms"],
    queryFn: () => getWorkspaceRooms({ id: workspaceId }),
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
