import { Button } from "@/feature/shared/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/feature/shared/ui/avatar";
import { Input } from "@/feature/shared/ui/input";
import { Label } from "@/feature/shared/ui/label";

const spaces = [
  {
    name: "Design Team",
    usage: "2.5GB / 5GB",
    members: 8,
    avatar: "",
  },
  {
    name: "Development",
    usage: "4.2GB / 10GB",
    members: 12,
    avatar: "",
  },
  {
    name: "Marketing",
    usage: "1.8GB / 5GB",
    members: 6,
    avatar: "",
  },
];

export const SpaceView = () => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-semibold">Space Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace storage and space allocation.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="new-space">Create new space</Label>
            <div className="flex gap-2">
              <Input
                id="new-space"
                placeholder="Space name"
                className="flex-1"
              />
              <Button>Create</Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">Spaces ({spaces.length})</h3>
          <div className="mt-4 space-y-4">
            {spaces.map((space) => (
              <div
                key={space.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={space.avatar} />
                    <AvatarFallback>
                      {space.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{space.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {space.usage}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {space.members} members
                  </p>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
