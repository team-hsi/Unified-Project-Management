"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/feature/shared/ui/button";
import { Card } from "@/feature/shared/ui/card";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
import { acceptInvite } from "@/actions/api/user/mutations";
import { toast } from "sonner";
import type { Invitation } from "@/actions/api/user/queries";

interface InvitationProps {
  inviteId: string;
  invitation?: Invitation | null;
}

export default function Invitation({ inviteId, invitation }: InvitationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!invitation) {
    return (
      <div className="p-6 text-destructive">
        Invitation not found or expired.
      </div>
    );
  }

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      await acceptInvite(inviteId);
      toast.success("Invitation accepted!");
      router.replace("/"); // Redirect after accept
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Failed to accept invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md w-full p-6 flex flex-col gap-4 items-center">
        <Avatar>
          <AvatarFallback>
            {invitation.inviter.firstname?.[0]?.toUpperCase()}
            {invitation.inviter.lastname?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-lg font-semibold">
          {invitation.inviter.firstname} {invitation.inviter.lastname} invited
          you
        </div>
        <div className="text-sm text-muted-foreground">
          Email: <span className="font-mono">{invitation.email}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Role: <span className="font-semibold">{invitation.role}</span>
        </div>
        <div className="text-xs text-gray-500">
          Sent: {new Date(invitation.createdAt).toLocaleString()}
        </div>
        <div>
          {invitation.status === "pending" ? (
            <Button onClick={handleAccept} disabled={loading}>
              {loading ? "Accepting..." : "Accept Invitation"}
            </Button>
          ) : (
            <span className="text-green-600 font-medium">
              Invitation already {invitation.status}
            </span>
          )}
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
      </Card>
    </div>
  );
}
