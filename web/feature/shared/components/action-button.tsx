import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
export const ActionButton = ({
  isLoading,
  label = "Save",
  loadingLabel = "Saving...",
  variant = "default",
  className,
  size = "default",
  ...props
}: {
  className?: string;
  isLoading: boolean;
  label?: string;
  loadingLabel?: string;
  variant?:
    | "link"
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg";
  props: React.ComponentProps<"button">;
}) => {
  return (
    <Button
      disabled={isLoading}
      {...props}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
};
