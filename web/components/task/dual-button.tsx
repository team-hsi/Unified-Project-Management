import { Button } from "@/components/ui/button";
import { Edit2, Trash } from "lucide-react";

export const DualButton = () => {
  return (
    <div className=" absolute opacity-0 top-0 right-0 group-hover:opacity-100 transition-opacity duration-300 m-0.5 -space-x-px rounded-lg shadow-sm rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant="outline"
        size="icon"
        aria-label="edit-item"
      >
        <Edit2 size={16} strokeWidth={1} aria-hidden="true" />
      </Button>
      <Button
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant="outline"
        size="icon"
        aria-label="delete-item"
      >
        <Trash size={16} strokeWidth={1} aria-hidden="true" />
      </Button>
    </div>
  );
};
