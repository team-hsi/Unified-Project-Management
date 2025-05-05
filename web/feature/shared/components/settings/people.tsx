"use client";
import { useState } from "react";
import { Separator } from "@/feature/shared/ui/separator";
import { Button } from "@/feature/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { Input } from "@/feature/shared/ui/input";
import { Avatar, AvatarFallback } from "@/feature/shared/ui/avatar";
import { Mail, Search, Send, Users } from "lucide-react";
import { Member } from "@/feature/shared/@types/user";
import { Card, CardContent } from "@/feature/shared/ui/card";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/use-workspace";
import { useParams } from "next/navigation";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarFallback: string;
}

export const PeopleView = () => {
  const { workspaceMembers, isLoadingWsMembers, errorWsMembers, inviteMember } =
    useWorkspace();
    const { workspaceId} = useParams<{workspaceId: string}>()
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [invite, setInvite] = useState<{
    email: string;
    role: Member['role']
  }>({
    email: "",
    role: "member",
  });

  if (isLoadingWsMembers) {
    return <div className="text-center">Loading...</div>;
  }
  if (errorWsMembers) {
    return <div className="text-center">Error loading members</div>;
  }

  const mappedMembers: TeamMember[] =
    workspaceMembers?.members?.map((member: Member) => {
      const user = member.user;
      const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;

      return {
        id: member.id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        role: member.role,
        avatarFallback: initials,
      };
    }) || [];
  // Handle role change
  const handleRoleChange = (memberId: string, newRole: string) => {
    // Here you would typically call an API to update the role
    // For now we'll just log it
    console.log(`Changing role for member ${memberId} to ${newRole}`);

    // You would implement the actual role update logic here
    // e.g., updateMemberRole(memberId, newRole);
  };

  // Filter members based on search query and role filter
  const filteredMembers = mappedMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter ? member.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });
  const handleInvite = async () => {
    toast.success("Invitation", {
      description: `You invited ${invite.email} as ${invite.role}`,
    });
    setInvite((prev) => ({
      ...prev,
      email: "",
    }));
    await inviteMember.mutateAsync({ userId: invite.email, role: invite.role , id: workspaceId});
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">People</h1>
        <p className="text-base text-muted-foreground">
          Manage team members and permissions.
        </p>
      </div>
      <Card className="mb-6 overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-100 dark:border-purple-800/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <Mail className="h-5 w-5" />
              <h3 className="font-medium">Invite team members</h3>
            </div>
            <div className="flex-1 w-full relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    className="pr-20 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800/50"
                    placeholder="colleague@example.com"
                    value={invite.email}
                    // type="email"
                    onChange={(e) =>
                      setInvite({ ...invite, email: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  />
                </div>

                <Select
                  value={invite.role}
                  onValueChange={(value: Member['role']) =>
                    setInvite({ ...invite, role: value })
                  }
                >
                  <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800/50">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-accent-foreground"
                  onClick={handleInvite}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={roleFilter || "all"}
          onValueChange={(value) =>
            setRoleFilter(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border bg-card">
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-muted-foreground mb-1">
              No members found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          filteredMembers.map((member, index) => (
            <div key={member.id}>
              <div className="flex items-center justify-between p-4 group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div></div>
                <Select
                  defaultValue={member.role}
                  onValueChange={(value: "admin" | "guest" | "member") => handleRoleChange(member.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {index < filteredMembers.length - 1 && <Separator />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
