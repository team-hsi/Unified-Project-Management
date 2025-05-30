"use client";

import { useRoom } from "@/feature/shared/hooks/use-room";
import { Room } from "@/feature/shared/@types/room";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export const ChatList = ({ searchTerm }: { searchTerm: string }) => {
  const { userRooms, errorRooms } = useRoom();

  const { workspaceId, chatId } = useParams<{
    workspaceId: string;
    chatId: string;
  }>();

  // Filter out duplicate rooms and rooms not belonging to the current workspace
  const uniqueRooms = React.useMemo(() => {
    const seen = new Set<string>();

    return userRooms.rooms.filter((room: Room) => {
      if (room.spaceId !== workspaceId) return false;
      if (seen.has(room.id)) return false;
      seen.add(room.id);
      return room.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [userRooms.rooms, workspaceId, searchTerm]);

  if (!uniqueRooms.length) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        No rooms available.
      </div>
    );
  }

  if (errorRooms) {
    return <div className="p-4">Error loading rooms</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {uniqueRooms.map((room: Room) => (
        <Link href={`/${workspaceId}/chat/${room.id}`} key={room.id}>
          <div
            className={cn(
              "px-4 py-3 border-b border-chat-border hover:bg-sidebar-accent/50 cursor-pointer transition-colors",
              room.id === chatId ? "bg-sidebar-accent" : ""
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/90 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {room.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="font-medium text-sm truncate">{room.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
