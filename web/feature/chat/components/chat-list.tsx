"use client";

import { useRoom } from "@/feature/shared/hooks/use-room";
import { Room } from "@/feature/shared/@types/room";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export const ChatList = () => {
  const { userRooms, errorRooms } = useRoom();

  const { workspaceId, chatId } = useParams<{
    workspaceId: string;
    chatId: string;
  }>();

  // Filter out duplicate rooms and rooms not belonging to the current workspace
  // const uniqueRooms = React.useMemo(() => {
  //   const seen = new Set<string>();
  //   return rooms.filter((room: Room) => {
  //     // Filter by workspaceId first
  //     if (room.spaceId !== workspaceId) return false;
  //     // Then filter out duplicates
  //     if (seen.has(room.id)) return false;
  //     seen.add(room.id);
  //     return true;
  //   });
  // }, [rooms, workspaceId]);

  // if (!uniqueRooms.length) {
  //   return (
  //     <div className="p-4 text-muted-foreground text-sm">
  //       No rooms available.
  //     </div>
  //   );
  // }
  const uniqueRooms = Array.from(
    new Map(userRooms.rooms.map((room) => [room.id, room])).values()
  );

  if (errorRooms) {
    return <div className="p-4">Error loading rooms</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {uniqueRooms.map((room: Room) => (
        <Link href={`/${workspaceId}/chat/${room.id}`} key={room.id}>
          <div
            className={cn(
              "p-3 border-b border-chat-border hover:bg-sidebar-accent cursor-pointer transition-colors",
              room.id === chatId ? "bg-sidebar-accent" : ""
            )}
          >
            <div className="flex items-start">
              <div className="relative">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-primary">
                  <span>{room.name.slice(0, 2)}</span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">{room.name}</h3>
                </div>
              </div>
              <div className="ml-2 bg-chat-message-sent rounded-full h-5 w-5 flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
