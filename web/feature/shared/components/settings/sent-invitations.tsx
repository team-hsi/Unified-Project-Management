"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
// import { Button } from "@/feature/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getSpaceInvitations } from "@/actions/api/workspace/queries";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/feature/shared/ui/table";

export function SentInvitations() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const {
    data: invitations,
    isPending,
    error,
  } = useQuery({
    queryKey: [workspaceId, "ws-invitations"],
    queryFn: () => getSpaceInvitations(workspaceId),
  });

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Sent Invitations</DialogTitle>
        <DialogDescription>
          View and manage invitations you&apos;ve sent to others.
        </DialogDescription>
      </DialogHeader>
      <Separator className="my-4" />

      {isPending ? (
        <div className="text-muted-foreground">Loading invitations...</div>
      ) : error ? (
        <div className="text-destructive">Failed to load invitations.</div>
      ) : !invitations || invitations.length === 0 ? (
        <div className="text-muted-foreground">
          You haven&apos;t sent any invitations yet.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invited Users</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {inv.email.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{inv.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Invited as {inv.role}
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
                  {/* <TableCell className="text-right">
                    {inv.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Cancel Invitation
                      </Button>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
