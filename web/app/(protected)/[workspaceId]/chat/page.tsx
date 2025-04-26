import { Chat } from "@/components/chat/chat";
import React from "react";
import { ChatProvider } from "@/components/chat/chat-context";
import { Metadata } from "next";
import { ChatStoreProvider } from "@/lib/stores/chat-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { getWorkspaceRooms } from "@/actions/workspace-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const metadata: Metadata = {
  title: "Chat",
  description: "Collaboration chat page",
};

const page = async ({
  params,
}: {
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
      <ChatProvider>
        <ChatStoreProvider>
          <Chat />
        </ChatStoreProvider>
      </ChatProvider>
    </HydrationBoundary>
  );
};

export default page;
