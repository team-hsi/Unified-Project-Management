"use client";

import { useParams } from "next/navigation";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { Room } from "@/feature/shared/@types/room";
import { Button } from "@/feature/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/feature/shared/ui/dialog";
import { Mic, MicOff, PhoneOff, Video, VideoOff, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";

interface AudioCallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AudioCall({
  open = false,
  onOpenChange = () => {},
}: AudioCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const { chatId } = useParams<{ chatId: string }>();
  const { userRooms } = useRoom();
  const activeRoom = userRooms.rooms.find((r: Room) => r.id === chatId);
  const { socket, isConnected } = useGlobalSocket();

  useEffect(() => {
    if (open && socket && isConnected) {
      socket.emit("start_call", { roomId: chatId });
    }
  }, [open, socket, isConnected, chatId]);

  const handleEndCall = () => {
    if (socket && isConnected) {
      socket.emit("end_call", { roomId: chatId });
    }
    onOpenChange(false);
  };

  const handleLeaveCall = () => {
    if (socket && isConnected) {
      socket.emit("leave_call", { roomId: chatId });
    }
    onOpenChange(false);
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    if (socket && isConnected) {
      socket.emit("toggle_mic", { roomId: chatId, isMuted: !isMuted });
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (socket && isConnected) {
      socket.emit("toggle_video", { roomId: chatId, isVideoOn: !isVideoOn });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <span>{activeRoom?.name?.substring(0, 2) || "AT"}</span>
            </div>
            <DialogTitle className="text-xl font-semibold mb-1">
              In Call
            </DialogTitle>
            <p className="text-gray-500 dark:text-gray-400">
              Connected with {activeRoom?.name || "user"}
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          <Button
            variant="outline"
            size="icon"
            className={`h-12 w-12 rounded-full ${
              isMuted ? "bg-red-100 dark:bg-red-900" : ""
            }`}
            onClick={handleToggleMic}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`h-12 w-12 rounded-full ${
              !isVideoOn ? "bg-red-100 dark:bg-red-900" : ""
            }`}
            onClick={handleToggleVideo}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleLeaveCall}
          >
            <LogOut className="h-6 w-6" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
