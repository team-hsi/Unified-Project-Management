"use client";
import { MessageCircle, Settings2 } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/feature/shared/ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { SettingsDialog } from "../components/settings/settings";
// import { useRoom } from "../hooks/use-room";

export const NavMain = () => {
  const t = useTranslations("Sidebar");
  const { workspaceId } = useParams<{ workspaceId: string }>();
  // const { prefetchRooms } = useRoom();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link
            href={`/${workspaceId}/chat`}
            prefetch={true}
            // onMouseEnter={prefetchRooms}
            // onFocus={prefetchRooms}
          >
            <MessageCircle className="mr-2" />
            Chat
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SettingsDialog>
          <SidebarMenuButton asChild className="cursor-pointer">
            <span className="flex items-center gap-4">
              <Settings2 />
              {t("settings")}
            </span>
          </SidebarMenuButton>
        </SettingsDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
