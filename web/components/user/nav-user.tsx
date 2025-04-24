"use client";

import { BadgeCheck, Bell, Loader, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSessionUser, logoutAction } from "@/actions/auth-actions";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export function NavUser() {
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getSessionUser,
  });
  if (isLoading || isPending)
    return (
      <Skeleton className="w-fit rounded-lg">
        <Avatar className="h-8 w-8 rounded-lg cursor-pointer hover:opacity-50">
          <AvatarFallback className="rounded-lg">
            <Loader className="animate-spin" size={16} />
          </AvatarFallback>
        </Avatar>
      </Skeleton>
    );
  if (!data) return <div>No user data found.</div>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted border hover:ring-1 hover:ring-ring ">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/identicon/svg?scale=50&radius=50&seed=${data.username}`}
            alt={`user ${data.username} avatar`}
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg border">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/identicon/svg?scale=50&radius=50&seed=${data.username}`}
                alt={`user ${data.username} avatar`}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data.username}</span>
              <span className="truncate text-xs">{data.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={async () => logoutAction()}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
