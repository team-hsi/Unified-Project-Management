import { Plus } from "lucide-react";
import { Button } from "../../ui/button";

export const EmptyLabelState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mb-2 rounded-full bg-muted p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-muted-foreground"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-medium">No labels yet</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Create labels to categorize and organize your projects.
      </p>
      <Button onClick={() => {}}>
        <Plus className="mr-2 h-4 w-4" />
        Create your first label
      </Button>
    </div>
  );
};
