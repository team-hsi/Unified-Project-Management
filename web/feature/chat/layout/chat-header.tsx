"use client";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { useMemo, useState } from "react";
import { Room } from "@/feature/shared/@types/room";
import { useParams } from "next/navigation";
import { ChatDetails } from "../components/info/chat-details";
import { ChatDropdown } from "../overlays/chat-dropdown";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Phone } from "lucide-react";
import { AudioCall } from "@/feature/call/overlays/audio-call";
// import { useSocketEvent } from "@/feature/notification/hooks/useSocketEvent";
import { useWebSocket } from "@/feature/notification/hooks/use-web-socket";
import { toast } from "sonner";
import { AudioReceiveCall } from "@/feature/call/overlays/audio-recive-call";

export function ChatHeader() {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callerId] = useState<string | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const { userRooms } = useRoom();

  useWebSocket("incoming_call", () => {
    // setCallerId(data.callerId);
    setIsIncomingCall(true);
  });

  const activeChat = useMemo(() => {
    const room = userRooms.rooms.find((r: Room) => r.id === chatId);
    return room?.name || "Select a Chat";
  }, [chatId, userRooms]);

  useWebSocket("user_join_call", (payload) => {
    console.log("user-joind", payload);
    toast.info("user joined");
  });

  return (
    <>
      <div className="border-b p-2 shadow-sm">
        <div className="flex items-center justify-between">
          <ChatDetails>
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span>{activeChat.substring(0, 2) || "AT"}</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold flex items-center">
                  {activeChat}
                </h1>
              </div>
            </div>
          </ChatDetails>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsCallOpen(true)}>
              <Phone />
            </Button>
            <ChatDropdown />
          </div>
        </div>
      </div>
      <AudioCall open={isCallOpen} onOpenChange={setIsCallOpen} />
      <AudioReceiveCall
        open={isIncomingCall}
        onOpenChange={setIsIncomingCall}
        callerId={callerId || undefined}
      />
    </>
  );
}
