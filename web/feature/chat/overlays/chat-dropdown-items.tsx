import { Button } from "@/feature/shared/ui/button";
import {
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/feature/shared/ui/alert-dialog";
import { Trash2, LogOut, Loader } from "lucide-react";
import { DropdownAction } from "@/feature/project/views/kanban/dropdown/bucket-dropdown-actions";
import { CustomAlertDialog } from "@/feature/shared/components/custom-alert";
import { useRoom } from "@/feature/shared/hooks/use-room";

export const LeaveChat = ({
  onSelect,
  onOpenChange,
  id,
  userId,
}: {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  id: string;
  userId: string;
}) => {
  const { removeMember } = useRoom();
  const handleLeave = async () => {
    onOpenChange?.(false);
    await removeMember.mutateAsync({ id, userId });
  };
  return (
    <CustomAlertDialog
      triggerChildren={<DropdownAction icon={LogOut} label="Leave Chat" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Are you sure you want to leave this Chat?</p>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={removeMember.isPending}
            onClick={handleLeave}
          >
            {removeMember.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
            {/* Delete */}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </CustomAlertDialog>
  );
};

export const DeleteChat = ({
  onSelect,
  onOpenChange,
  id,
}: {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  id: string;
}) => {
  const { remove } = useRoom();
  const handleDelete = async () => {
    onOpenChange?.(false);
    await remove.mutateAsync(id);
  };

  return (
    <CustomAlertDialog
      triggerChildren={<DropdownAction icon={Trash2} label="Delete Chat" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Are you sure you want to delete this bucket? This action cannot be
          undone.
        </p>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={remove.isPending}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </CustomAlertDialog>
  );
};
