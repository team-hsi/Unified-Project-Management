import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import { useId, useState } from "react";

export const DeleteProjectDialog = ({
  projectName,
}: {
  projectName: string;
}) => {
  const id = useId();
  const [inputValue, setInputValue] = useState("");

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Final confirmation
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            This action cannot be undone. To confirm, please enter
            <span className="text-foreground italic font-medium">
              &quot;delete-{projectName}&quot;
            </span>
            .
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={id} className=" sr-only">
            Project name
          </Label>
          <Input
            id={id}
            type="text"
            placeholder="Type project name to confirm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" className="flex-1">
            Delete
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
