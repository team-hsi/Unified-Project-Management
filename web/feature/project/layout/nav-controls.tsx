import { useRouter } from "next/navigation";
import { Button } from "@/feature/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const NavigationControls = () => {
  const router = useRouter();
  return (
    <div className="flex items-center">
      <Button
        onClick={() => router.back()}
        className="h-7 w-7"
        variant="ghost"
        size="icon"
      >
        <ChevronLeft />
      </Button>
      <Button
        onClick={() => router.forward()}
        className="h-7 w-7"
        variant="ghost"
        size="icon"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
