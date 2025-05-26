"use client";

import { Room } from "@/feature/shared/@types/room";
import { Button } from "@/feature/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/feature/shared/ui/dialog";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";
import { useEffect, useRef, useState } from "react";

interface AudioCallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  room: Room;
}

export function AudioCall({
  open = false,
  onOpenChange = () => {},
  room,
}: AudioCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const { socket, isConnected } = useGlobalSocket();

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const setupCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Add local stream tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote stream
      pc.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        event.streams[0].getTracks().forEach((track) => {
          remoteStreamRef.current?.addTrack(track);
        });

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStreamRef.current;
          remoteAudioRef.current
            .play()
            .catch((e) => console.error("Audio play failed:", e));
        }
      };

      // ICE candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("signal", {
            to: room.id, // Using room ID as target for signaling
            data: event.candidate,
          });
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.emit("start_call", {
          roomId: room.id,
          roomName: room.name,
          offer: pc.localDescription,
        });
      }

      setIsInCall(true);
    } catch (error) {
      console.error("Call setup failed:", error);
      handleEndCall();
    }
  };

  const handleSignal = async ({ from, data }: { from: string; data: any }) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    // SDP handling
    if (data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === "offer") {
        // If you receive an offer, create and send an answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit("signal", {
          to: from,
          data: { sdp: pc.localDescription },
        });
      }
    }

    // ICE candidate handling
    if (data.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    setupCall();
    socket.on("signal", handleSignal);

    return () => {
      socket.off("signal", handleSignal);
      cleanup();
    };
  }, [open, socket, isConnected]);

  const cleanup = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    setIsInCall(false);
  };

  const handleEndCall = () => {
    if (socket && isConnected) {
      socket.emit("end_call", { roomId: room.id });
    }
    cleanup();
    onOpenChange(false);
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <span>{room.name?.substring(0, 2) || "AT"}</span>
            </div>
            <DialogTitle className="text-xl font-semibold mb-1">
              {isInCall ? "In Call" : "Calling..."}
            </DialogTitle>
            <p className="text-gray-500 dark:text-gray-400">
              {isInCall
                ? `Connected with ${room.name}`
                : `Dialing ${room.name}...`}
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
            disabled={!isInCall}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
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
        <audio ref={remoteAudioRef} autoPlay playsInline hidden />
      </DialogContent>
    </Dialog>
  );
}
