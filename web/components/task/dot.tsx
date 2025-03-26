import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dotVariants = cva("rounded-full bg-muted", {
  variants: {
    size: {
      default: "w-2.5 h-2.5",
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function Dot({
  className,
  size,
}: React.ComponentProps<"span"> & VariantProps<typeof dotVariants>) {
  return <span className={cn(dotVariants({ size, className }))} />;
}

export { Dot, dotVariants };
