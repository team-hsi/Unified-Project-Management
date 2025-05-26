"use client";

import { Button } from "@/feature/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/feature/shared/ui/dialog";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface AudioReceiveCallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  callerId?: string | null;
  roomName?: string | null;
}

export function AudioReceiveCall({
  open = false,
  onOpenChange = () => {},
  callerId,
  roomName,
}: AudioReceiveCallProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { socket, isConnected } = useGlobalSocket();

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const setupPeerConnection = async (offer: RTCSessionDescription) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

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
            to: callerId,
            data: event.candidate,
          });
        }
      };

      // Connection state changes
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setIsAccepted(true);
          // setIsInCall(true);
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          cleanup();
        }
      };

      // Set remote description from offer
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket) {
        socket.emit("accept_call", {
          roomId: chatId,
          callerId,
          answer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error("Error setting up peer connection:", error);
      cleanup();
    }
  };

  const handleSignal = async (data: {
    type?: RTCSdpType;
    sdp?: string;
    candidate?: RTCIceCandidate;
  }) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      console.log("pc", pc);
      console.log("data-pc", data);
      // if (data.type === "answer" && data.sdp) {
      //   await pc.setRemoteDescription(
      //     new RTCSessionDescription({ type: data.type, sdp: data.sdp })
      //   );
      //   setIsAccepted(true);
      // } else if (data.candidate) {
      //   await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      // }
    } catch (error) {
      console.error("Error handling signal:", error);
      cleanup();
    }
  };

  useEffect(() => {
    if (!open || !socket || !isConnected) return;

    socket.on("signal", handleSignal);

    return () => {
      socket.off("signal", handleSignal);
      if (!isAccepted) cleanup();
    };
  }, [open, socket, isConnected, isAccepted]);

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
  };

  const handleAcceptCall = async () => {
    if (!socket || !isConnected) return;

    socket.emit("join_call", { callerId, roomId: chatId }, (data: any) => {
      if (data.offer) {
        setupPeerConnection(data.offer);
      } else {
        console.error("No offer received");
        cleanup();
      }
    });
    console.log("am here");
    setIsAccepted(true);
  };

  const handleEndCall = () => {
    if (socket && isConnected) {
      socket.emit("leave_call", { roomId: chatId });
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

  useEffect(() => {
    if (!open) {
      cleanup();
    }
  }, [open]);
  console.log("state", isAccepted);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div
              className={`h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mx-auto mb-4 ${
                !isAccepted ? "animate-pulse" : ""
              }`}
            >
              <span>{roomName?.substring(0, 2) || "AT"}</span>
            </div>
            <DialogTitle className="text-xl font-semibold mb-1">
              {isAccepted ? "In Call" : "Incoming Call"}
            </DialogTitle>
            <p className="text-gray-500 dark:text-gray-400">
              {isAccepted
                ? `Connected with ${roomName}`
                : `${roomName || "Someone"} is calling...`}
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          {!isAccepted ? (
            <>
              <Button variant="destructive" size="lg" onClick={handleEndCall}>
                <PhoneOff className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button size="lg" onClick={handleAcceptCall}>
                <Phone className="mr-2 h-4 w-4" />
                Accept
              </Button>
            </>
          ) : (
            <>
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
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </>
          )}
        </DialogFooter>
        <audio ref={remoteAudioRef} autoPlay playsInline hidden />
      </DialogContent>
    </Dialog>
  );
}
