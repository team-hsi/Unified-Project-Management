import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ReactElement } from "react";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  label?: string | ReactElement;
  loadingLabel?: string;
  variant?:
    | "link"
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg";
}

export const ActionButton = ({
  isLoading,
  label = "Save",
  loadingLabel = "Saving...",
  variant = "default",
  className,
  size = "default",
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
      {...props}
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
