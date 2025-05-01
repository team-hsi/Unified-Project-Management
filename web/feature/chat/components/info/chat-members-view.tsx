import React from "react";
import { Input } from "@/feature/shared/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useMember } from "@/feature/shared/hooks/use-member";
import { Member } from "@/feature/shared/@types/user";
import { ChatSheetHeader } from "../../layout/chat-sheet-header";

interface ChatMembersViewProps {
  onClose: () => void;
  onMemberClick: (member: Member) => void;
}

export const ChatMembersView = ({
  onClose,
  onMemberClick,
}: ChatMembersViewProps) => {
  const { chatMembers, isChatMembersPending } = useMember();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredMembers = chatMembers?.filter((member: Member) => {
    const fullName =
      `${member.user.firstname} ${member.user.lastname}`.toLowerCase();
    const email = member.user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="flex flex-col h-full">
      <ChatSheetHeader title="Chat Members" onClose={onClose} />
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {isChatMembersPending ? (
            <div className="text-center text-muted-foreground p-4">
              Loading members...
            </div>
          ) : filteredMembers?.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              {searchQuery ? "No members found" : "No members yet"}
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredMembers?.map((member: Member) => (
                <div
                  key={member.user.id}
                  onClick={() => onMemberClick(member)}
                  className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors cursor-pointer"
                >
                  <Avatar className="size-10 border rounded-full flex items-center justify-center">
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
      </div>
    </div>
  );
};
