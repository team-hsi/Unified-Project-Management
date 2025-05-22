"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/feature/shared/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteLabelProps {
  children: React.ReactNode;
  confirmDelete: () => void;
}

export function DeleteLabel({ children, confirmDelete }: DeleteLabelProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-background via-background/95 to-background border-destructive/20 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Delete Label
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            This action cannot be undone. This will permanently delete the label
            and remove it from all associated items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="hover:bg-accent/5 transition-all duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Label
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
