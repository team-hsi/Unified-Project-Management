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
import { Pencil } from "lucide-react";
import { useId, useState } from "react";

export const EditProjectDialog = ({ projectName }: { projectName: string }) => {
  const id = useId();
  const [inputValue, setInputValue] = useState(projectName);

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          <Pencil className="opacity-80" size={16} strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">Edit Project</DialogTitle>
          <DialogDescription className="sm:text-center">
            Make changes to your project here.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={id}>Project Name</Label>
          <Input
            id={id}
            type="text"
            placeholder="Type Origin UI to confirm"
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
          <Button type="button" className="flex-1">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
