"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { getDocUsers } from "@/actions/api/user/queries";

export function Room({
  children,
  docId,
}: {
  children: ReactNode;
  docId: string;
}) {
  return (
    <LiveblocksProvider
      resolveUsers={async ({ userIds }) => {
        // Get users from your back end
        const users = await getDocUsers(userIds);

        // Return a list of users
        return users;
      }}
      publicApiKey={
        "pk_prod_JkhNVz01ZJ7kWWj3tuujajE3ifR85KskdznqyJlxhyTLTlR0IVOwlvNrgmS8JrPs"
      }
    >
      <RoomProvider id={docId} initialPresence={{ cursor: { x: 0, y: 0 } }}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
