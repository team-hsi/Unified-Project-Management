import * as React from "react";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Label } from "@/feature/shared/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/feature/shared/ui/drawer";
import { Plus } from "lucide-react";
import { useRoom } from "@/feature/shared/hooks/use-room";

export const NewChat = () => {
  const { createRoom } = useRoom();
  const [name, setName] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCreateRoom = () => {
    setName("");
    setIsOpen(false);
    createRoom.mutate({ name });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-4 h-5 p-0 hover:bg-background ">
          <Plus className="text-muted-foreground hover:scale-110" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Chat Room</DrawerTitle>
            <DrawerDescription>
              Enter a name for your new chat room.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid gap-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Project Alpha Discussion"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleCreateRoom} disabled={!name.trim()}>
              Create
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
