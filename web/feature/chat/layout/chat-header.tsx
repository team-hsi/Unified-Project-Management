"use client";

import { useRoom } from "@/feature/shared/hooks/use-room";
import { useMemo, useState, useEffect, useRef } from "react";
import { Room } from "@/feature/shared/@types/room";
import { useParams } from "next/navigation";
import { ChatDetails } from "../components/info/chat-details";
import { ChatDropdown } from "../overlays/chat-dropdown";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Phone } from "lucide-react";
import { AudioCall } from "@/feature/call/overlays/audio-call";
import { AudioReceiveCall } from "@/feature/call/overlays/audio-recive-call";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";
import { toast } from "sonner";

export function ChatHeader() {
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState<{
    callerId: string | null;
    roomName: string | null;
  }>({ callerId: null, roomName: null });
  const peersRef = useRef<{ [peerId: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null); // Already in your code
  const remoteStreamsRef = useRef<{ [peerId: string]: MediaStream }>({});

  const { chatId } = useParams<{ chatId: string }>();
  const { userRooms } = useRoom();
  const { socket } = useGlobalSocket();

  const activeChat = useMemo(() => {
    return userRooms.rooms.find((r: Room) => r.id === chatId);
  }, [chatId, userRooms]);

  function renderRemoteStream(peerId: string, stream: MediaStream) {
    remoteStreamsRef.current[peerId] = stream;
    // You can update state or refs to attach this stream to an <audio> element
  }

  function startWebRTCWith(peerId: string) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peersRef.current[peerId] = pc;

    // Add local tracks
    localStreamRef.current
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStreamRef.current!));

    // ICE candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket?.emit("signal", {
          to: peerId,
          data: { candidate: e.candidate },
        });
      }
    };

    // Remote stream
    pc.ontrack = (e) => renderRemoteStream(peerId, e.streams[0]);

    // If initiator
    pc.createOffer()
      .then((o) => pc.setLocalDescription(o))
      .then(() => {
        socket?.emit("signal", {
          to: peerId,
          data: { sdp: pc.localDescription },
        });
      });
  }

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: {
      callerId: string;
      roomName: string;
      roomId: string;
    }) => {
      if (data.roomId === chatId) {
        toast.info(`Incoming call from ${data.roomName}`);
        setCallerInfo({ callerId: data.callerId, roomName: data.roomName });
        setIsReceivingCall(true);
      }
    };
    socket.on("call-participants", (peerIds: []) => {
      // console.log("call-participants ✅", peerIds);
      peerIds.forEach((clientId, userObj) => {
        console.log("cccc", clientId, userObj);
        startWebRTCWith(clientId);
      });
    });
    socket.on("user-joined-call", (peerId: string) => {
      startWebRTCWith(peerId);
    });
    socket.on("incoming_call", handleIncomingCall);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
    };
  }, [socket, chatId]);

  const handleStartCall = () => {
    if (activeChat) {
      setIsCalling(true);
    }
  };

  return (
    <>
      <div className="border-b p-2 shadow-sm cursor-pointer">
        <div className="flex items-center justify-between">
          <ChatDetails>
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span>{activeChat?.name?.substring(0, 2) || "AT"}</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold flex items-center">
                  {activeChat?.name || "Select a Chat"}
                </h1>
              </div>
            </div>
          </ChatDetails>
          <div className="flex items-center space-x-2">
            <Button onClick={handleStartCall} disabled={!activeChat}>
              <Phone />
            </Button>
            <ChatDropdown />
          </div>
        </div>
      </div>

      {activeChat && (
        <AudioCall
          open={isCalling}
          onOpenChange={setIsCalling}
          room={activeChat}
        />
      )}

      <AudioReceiveCall
        open={isReceivingCall}
        onOpenChange={setIsReceivingCall}
        callerId={callerInfo.callerId}
        roomName={callerInfo.roomName}
      />
    </>
  );
}
