"use client";
import { Button } from "@/feature/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/feature/shared/ui/avatar";
import { ArrowRight, Loader } from "lucide-react";
import { Workspace } from "../shared/@types/space";
import { useMutation } from "@tanstack/react-query";
import { updateUserActiveSpace } from "@/actions/api/user/mutations";
const SelectWorkspace = ({ workspaces }: { workspaces: Workspace[] }) => {
  const updateSpace = useMutation({
    mutationFn: updateUserActiveSpace,
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-0">
        <CardHeader className="text-center p-6 pb-0">
          <CardTitle className="text-2xl text-center">
            Choose Your Workspace
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Select an organization to continue
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {workspaces.map((workspace) => (
            <Button
              key={workspace.id}
              variant="ghost"
              className="w-full justify-between h-16 rounded-none border-b last:border-b-0 first:border-t hover:bg-accent group"
              onClick={async () => {
                await updateSpace.mutateAsync(workspace.id);
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${workspace.name}.png`}
                    alt={workspace.name}
                  />
                  <AvatarFallback>
                    {workspace.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="">{workspace.name}</span>
              </div>
              {updateSpace.isPending ? (
                <Loader className=" animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 mr-5 text-background group-hover:text-primary group-hover:translate-x-1 transition-all" />
              )}
            </Button>
          ))}

          {/* <Button
            variant="ghost"
            className="w-full justify-between h-16 rounded-none bg-accent"
          >
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="bg-primary/10 border-2 p-0.5 border-dashed  border-primary/30 rounded-full">
                <Plus className="h-3 w-3 text-primary" />
              </div>
              <span className="font-medium text-muted-foreground  group-hover:text-primary">
                Create New Workspace
              </span>
            </div>
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectWorkspace;
