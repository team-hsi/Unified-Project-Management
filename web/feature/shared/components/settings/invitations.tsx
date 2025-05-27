"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Card } from "@/feature/shared/ui/card";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
import { Button } from "@/feature/shared/ui/button";
import { useUser } from "@/lib/auth/auth-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInvitations } from "@/actions/api/user/queries";
import { acceptInvite } from "@/actions/api/user/mutations";
import { toast } from "sonner";

export function Invitations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: invitations,
    isPending,
    error,
  } = useQuery({
    queryKey: [user?.id, "user-invite"],
    queryFn: getUserInvitations,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user?.id, "user-invite"] });
      toast.success("Invitation accepted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to accept invitation: ${error.message}`);
    },
  });

  // const declineMutation = useMutation({
  //   mutationFn: declineInvitation,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [user?.id, "user-invite"] });
  //   },
  // });

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Invitations</DialogTitle>
        <DialogDescription>
          Manage your pending workspace invitations.
        </DialogDescription>
      </DialogHeader>
      <Separator className="my-4" />

      {isPending ? (
        <div className="text-muted-foreground">Loading invitations...</div>
      ) : error ? (
        <div className="text-destructive">Failed to load invitations.</div>
      ) : !invitations || invitations.length === 0 ? (
        <div className="text-muted-foreground">You have no invitations.</div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <Card
              key={inv.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {inv.inviter.firstname?.[0]?.toUpperCase()}
                    {inv.inviter.lastname?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {inv.inviter.firstname} {inv.inviter.lastname}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {inv.inviter.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Invited you as{" "}
                    <span className="font-semibold">{inv.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <span
                  className={
                    inv.status === "pending"
                      ? "text-yellow-600 font-medium"
                      : inv.status === "accepted"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  Sent {new Date(inv.createdAt).toLocaleString()}
                </span>
                {inv.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={async () =>
                        await acceptMutation.mutateAsync(inv.id)
                      }
                      disabled={acceptMutation.isPending}
                    >
                      {acceptMutation.isPending ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      // onClick={() => declineMutation.mutate(inv.id)}
                      // disabled={declineMutation.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
