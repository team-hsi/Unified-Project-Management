"use client";
import { Bell, MessageCircle, Search, Settings2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SettingsDialog } from "../settings/settings";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const NavMain = () => {
  const t = useTranslations("Sidebar");
  const { workspaceId } = useParams<{ workspaceId: string }>();
  return (
    <SidebarGroup>
      <SidebarGroupLabel
        asChild
        className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      ></SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Search className="mr-2" />
                {t("search")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Bell className="mr-2" />
                {t("notifications")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/${workspaceId}/chat`} prefetch={true}>
                <MessageCircle className="mr-2" />
                Chat
                {/* {t("notifications")} */}
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
