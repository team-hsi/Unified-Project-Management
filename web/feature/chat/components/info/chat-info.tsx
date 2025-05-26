import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Bell, SquareArrowOutUpRight, UserPlus } from "lucide-react";
import React from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";
import { Tabs, TabsContent, TabsList } from "@/feature/shared/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/feature/shared/ui/sheet";
import { ChatUserInfo } from "./chat-user-info";
import { Member } from "@/feature/shared/@types/user";
import { ChatInfoEdit } from "./chat-info-edit";
import { useRoom } from "@/feature/shared/hooks/use-room";
import { useParams } from "next/navigation";
import { ChatMembersView } from "./chat-members-view";
import { Room } from "@/feature/shared/@types/room";
import { Button } from "@/feature/shared/ui/button";
import { ChatSheetHeader } from "../../layout/chat-sheet-header";
import { AddMemberDialog } from "../../overlays/add-member";

interface ChatInfoProps {
  onClose?: () => void;
}

export const ChatInfo = ({ onClose }: ChatInfoProps) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [viewMembers, setViewMembers] = React.useState(false);

  const { userRooms, roomMembers, isPendingRoomMembers } = useRoom();
  const { chatId } = useParams<{ chatId: string }>();
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null
  );

  const currentRoom = userRooms.rooms?.find((room: Room) => room.id === chatId);

  return (
    <div className="flex flex-col h-full">
      <ChatSheetHeader
        title="Group Chat"
        onClose={onClose}
        onNext={() => setOpenEdit(true)}
      />
      <div className="flex-grow overflow-y-auto">
        <div className="p-6 pt-3 gap-3 flex flex-col items-center border-b">
          <Avatar className="w-20 h-20 bg-muted-foreground rounded-full flex items-center justify-center">
            <AvatarFallback>Av</AvatarFallback>
          </Avatar>
          <CardHeader className="text-center">
            <CardTitle>{currentRoom?.name}</CardTitle>
            <CardDescription className="">
              {roomMembers?.members.length || 0} members
            </CardDescription>
          </CardHeader>
        </div>
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Bell size={16} />
              </div>
              <span>Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6  peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
        <div className="px-4">
          <Tabs defaultValue="members" className="w-full mb-4">
            <TabsList className="h-auto rounded-none border-b border-border bg-transparent w-full pb-0">
              <TabsTrigger
                value="members"
                className="underline-tab data-[state=active]:bg-transparent flex-1 items-center justify-center flex gap-3 data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <span>Members</span>{" "}
                <SquareArrowOutUpRight
                  size={14}
                  className=" hover:text-blue-500"
                  onClick={() => setViewMembers(true)}
                />
              </TabsTrigger>
              <TabsTrigger
                value="demo"
                className="underline-tab data-[state=active]:bg-transparent flex-1 data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                Permissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="mt-4">
              <ScrollArea className="h-[300px]">
                {isPendingRoomMembers ? (
                  <div className="text-center text-muted-foreground">
                    Loading members...
                  </div>
                ) : roomMembers?.members.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No members yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {roomMembers?.members.map((member: Member) => (
                      <div
                        key={member.user.id}
                        onClick={() => setSelectedMember(member)}
                        className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors cursor-pointer"
                      >
                        <Avatar className="size-8 ">
                          <AvatarFallback>
                            {`${member.user.firstname.charAt(
                              0
                            )}${member.user.lastname.charAt(0)}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {member.user.firstname} {member.user.lastname}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.user.email}
                          </span>
                        </div>
                        <div className="ml-auto">
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="demo"> placeholder</TabsContent>
          </Tabs>
        </div>
        <AddMemberDialog>
          <Button className="absolute bottom-6 right-6 size-12 rounded-full shadow-lg p-2">
            <UserPlus size={20} />
          </Button>
        </AddMemberDialog>
      </div>

      <Sheet
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <SheetContent className="rounded-xl overflow-auto">
          <SheetTitle className="sr-only">User Info</SheetTitle>
          {selectedMember && (
            <ChatUserInfo
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={openEdit} onOpenChange={() => setOpenEdit(false)}>
        <SheetContent className="rounded-xl overflow-auto">
          <SheetTitle className="sr-only">Edit Chat Info</SheetTitle>
          <ChatInfoEdit onClose={() => setOpenEdit(false)} room={currentRoom} />
        </SheetContent>
      </Sheet>

      <Sheet open={viewMembers} onOpenChange={() => setViewMembers(false)}>
        <SheetContent className="rounded-xl overflow-auto">
          <SheetTitle className="sr-only">Chat Members</SheetTitle>
          <ChatMembersView
            onClose={() => setViewMembers(false)}
            onMemberClick={(member) => setSelectedMember(member)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
