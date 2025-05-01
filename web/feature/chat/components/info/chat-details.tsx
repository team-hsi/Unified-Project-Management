/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/feature/shared/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatInfo } from "./chat-info";
import { ChatInfoEdit } from "./chat-info-edit";
import { ChatMembersView } from "./chat-members-view";
import { ChatUserInfo } from "./chat-user-info";

export const ChatDetails = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  const [openChatSheet, setOpenChatSheet] = React.useState(false);
  return (
    <Sheet open={openChatSheet} onOpenChange={setOpenChatSheet}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        hideClose
        className={`rounded-xl overflow-auto ${
          isMobile ? "h-full" : "max-w-lg"
        }`}
        side={isMobile ? "bottom" : "right"}
      >
        <SheetTitle className="sr-only"> Chat Info</SheetTitle>
        <ChatInfo onClose={() => setOpenChatSheet(false)} />
      </SheetContent>
    </Sheet>
  );
};
