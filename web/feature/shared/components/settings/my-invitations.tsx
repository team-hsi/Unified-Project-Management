"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
import { Button } from "@/feature/shared/ui/button";
import { useUser } from "@/lib/auth/auth-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInvitations, Invitation } from "@/actions/api/user/queries";
import { acceptInvite } from "@/actions/api/user/mutations";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/feature/shared/ui/table";

export function MyInvitations() {
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
      queryClient.invalidateQueries({
        queryKey: [user?.id, "workspaces"],
      });
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invited By</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv: Invitation) => (
                <TableRow key={inv.id}>
                  <TableCell>
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{inv.role}</span>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={async () =>
                            await acceptMutation.mutateAsync({
                              inviteId: inv.id,
                              inviterId: inv.inviter.id,
                            })
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
