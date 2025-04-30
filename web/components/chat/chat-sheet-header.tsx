import { ChevronLeft, Edit2 } from "lucide-react";
import { Button } from "../ui/button";

interface ChatSheetHeaderProps {
  title: string;
  onNext?: () => void;
  onClose?: () => void;
}
export const ChatSheetHeader = ({
  onNext,
  onClose,
  title,
}: ChatSheetHeaderProps) => {
  return (
    <div className="flex h-12 items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        {onClose && (
          <Button className="" variant="ghost" onClick={onClose}>
            <ChevronLeft size={20} />
          </Button>
        )}
        <h2 className="text-xl font-medium">{title}</h2>
      </div>
      {onNext && (
        <Button className="" variant="ghost" onClick={onNext}>
          <Edit2 size={16} />
        </Button>
      )}
    </div>
  );
};
