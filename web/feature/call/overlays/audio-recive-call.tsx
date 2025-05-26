// @ts-nocheck
"use client";
import * as mediasoupClient from "mediasoup-client";
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
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AudioReceiveCallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  callerId?: string;
}

export function AudioReceiveCall({
  open = false,
  onOpenChange = () => {},
  callerId,
}: AudioReceiveCallProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const sendTransportRef = useRef<any>(null);
  const recvTransportRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { userRooms } = useRoom();
  const activeRoom = userRooms.rooms.find((r: Room) => r.id === chatId);
  const { socket, isConnected } = useGlobalSocket();
  console.log(isAccepted ? "Call accepted 1" : "Incoming call 1");
  console.log(open ? "open" : "not open");

  useEffect(() => {
    toast.info(isAccepted ? "Call accepted" : "Incoming call");
    if (!socket || !isConnected) return;

    const handleTransportCreated = async (data: any) => {
      console.log("Transport created:", data);

      if (!deviceRef.current) {
        const device = new mediasoupClient.Device();
        await device.load({
          routerRtpCapabilities: data.routerRtpCapabilities,
        });
        deviceRef.current = device;
      }

      // === SEND TRANSPORT ===
      sendTransportRef.current = deviceRef.current.createSendTransport(
        data.sendTransportOptions
      );

      sendTransportRef.current.on(
        "connect",
        ({ dtlsParameters }, callback, errback) => {
          socket.emit("connect_transport", { dtlsParameters });
          callback();
        }
      );

      sendTransportRef.current.on(
        "produce",
        ({ kind, rtpParameters }, callback) => {
          socket.emit("produce", { kind, rtpParameters }, (response: any) => {
            callback({ id: response.id });
          });
        }
      );

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = stream.getAudioTracks()[0];
      await sendTransportRef.current.produce({ track: audioTrack });

      // === RECEIVE TRANSPORT ===
      recvTransportRef.current = deviceRef.current.createRecvTransport(
        data.recvTransportOptions
      );

      recvTransportRef.current.on(
        "connect",
        ({ dtlsParameters }, callback, errback) => {
          socket.emit("connect_recv_transport", { dtlsParameters });
          callback();
        }
      );
    };

    const handleNewProducer = ({ producerId }: any) => {
      console.log("New producer detected:", producerId);
      socket.emit(
        "consume",
        {
          producerId,
          rtpCapabilities: deviceRef.current?.rtpCapabilities,
        },
        async (data: any) => {
          const consumer = await recvTransportRef.current.consume({
            id: data.id,
            producerId: data.producerId,
            kind: data.kind,
            rtpParameters: data.rtpParameters,
          });

          const remoteStream = new MediaStream();
          remoteStream.addTrack(consumer.track);

          if (audioRef.current) {
            audioRef.current.srcObject = remoteStream;
            audioRef.current.play();
          }
        }
      );
    };

    socket.on("transport_created", handleTransportCreated);
    socket.on("new_producer", handleNewProducer);

    return () => {
      socket.off("transport_created", handleTransportCreated);
      socket.off("new_producer", handleNewProducer);
    };
  }, [socket, isConnected]);

  const handleAcceptCall = () => {
    if (socket && isConnected) {
      socket.emit("join_call", { roomId: chatId, callerId });
      setIsAccepted(true);
    }
  };

  const handleRejectCall = () => {
    if (socket && isConnected) {
      socket.emit("leave_call", { roomId: chatId, callerId });
    }
    onOpenChange(false);
  };

  const handleToggleMic = () => {
    setIsMuted((prev) => !prev);
    // Optionally stop sending audio track from stream
  };

  const handleToggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    // Implement video logic if needed
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              <span>{activeRoom?.name?.substring(0, 2) || "AT"}</span>
            </div>
            <DialogTitle className="text-xl font-semibold mb-1">
              {isAccepted ? "In Call" : "Incoming Call"}
            </DialogTitle>
            <p className="text-gray-500 dark:text-gray-400">
              {activeRoom?.name || "Someone"} is calling...
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          {!isAccepted ? (
            <>
              <Button variant="destructive" onClick={handleRejectCall}>
                <PhoneOff className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleAcceptCall}>
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
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handleRejectCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </>
          )}
        </DialogFooter>
        <audio ref={audioRef} hidden autoPlay />
      </DialogContent>
    </Dialog>
  );
}
