import { Bell, Search, Settings2 } from "lucide-react";
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

export const NavMain = () => {
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
                Search
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Bell className="mr-2" />
                Notifications
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SettingsDialog>
              <SidebarMenuButton asChild className="cursor-pointer">
                <span className="flex items-center gap-4">
                  <Settings2 />
                  Settings
                </span>
              </SidebarMenuButton>
            </SettingsDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
