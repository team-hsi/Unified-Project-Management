"use client";
import { useState } from "react";
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";
import { Badge } from "@/feature/shared/ui/badge";
import { Permission, Workspace } from "../../@types/space";
import { Role } from "../../@types/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/feature/shared/ui/table";
import { Checkbox } from "../../ui/checkbox";
import { useWorkspace } from "../../hooks/use-workspace";
import { ActionButton } from "../action-button";
import { useUser } from "@/lib/auth/auth-provider";

interface PermissionsViewProps {
  workspace: Workspace;
}

const roles: Role[] = ["owner", "admin", "member", "guest"];

const permissionLabels: Record<keyof Permission, string> = {
  update: "Update Space",
  add_member: "Add Member",
  remove_member: "Remove Member",
  update_member_role: "Update Member Role",
  create_room: "Create Room",
  read_room: "Read Room",
  read_all_rooms: "Read All Rooms",
};

export function PermissionsView({ workspace }: PermissionsViewProps) {
  const [permissions, setPermissions] = useState<Permission>(
    workspace.permissions
  );

  const { update } = useWorkspace();
  const { session, user } = useUser();

  const togglePermission = (permission: keyof Permission, role: Role) => {
    setPermissions((prev) => {
      const currentRoles = prev[permission];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role];
      return { ...prev, [permission]: newRoles };
    });
  };
  console.log("session", session);
  console.log("user", user);

  const handlePermission = async () => {
    await update.mutateAsync({ id: workspace.id, permissions: permissions });
    // console.log(workspace);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Permissions</h2>
          <p className="text-sm text-muted-foreground">
            Manage role-based permissions for your workspace
          </p>
        </div>
        <ActionButton
          isLoading={update.isPending}
          label="Save Changes"
          loadingLabel="Saving..."
          onClick={handlePermission}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableCaption>
                Workspace Role based permission matrix
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-3 px-4 text-left font-semibold">
                    Permission
                  </TableHead>
                  {roles.map((role) => (
                    <TableHead
                      key={role}
                      className="py-3 px-4 text-center font-semibold"
                    >
                      <Badge
                        className="capitalize py-1 px-4 text-sm border-none"
                        variant="outline"
                      >
                        {role}
                      </Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <TableRow
                    key={key}
                    className="border-t last:border-b transition"
                  >
                    <TableCell className="px-4 py-3 font-medium">
                      {label}
                    </TableCell>
                    {roles.map((role) => {
                      const checked =
                        permissions[key as keyof Permission].includes(role);
                      return (
                        <TableCell key={role} className="text-center">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              togglePermission(key as keyof Permission, role)
                            }
                            className={`rounded-lg border transition-all outline-none`}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
