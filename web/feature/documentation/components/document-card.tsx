import { Button } from "@/components/tiptap-ui-primitive/button";
import { Document } from "@/feature/shared/@types/document";
import { useDocument } from "@/feature/shared/hooks/use-document";
import { formatDistanceToNow } from "date-fns";
import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";

export const DocumentCard = ({
  workspaceId,
  doc,
}: {
  workspaceId: string;
  doc: Document;
}) => {
  const { remove } = useDocument();

  const handleRemove = async () => {
    await remove.mutateAsync({ id: doc.id, projectId: doc.projetId });
  };
  return (
    <Link
      href={`/${workspaceId}/${doc.projetId}/${doc.id}`}
      className="block group"
    >
      <div className="border w-44 rounded-lg overflow-hidden hover:border-primary transition-colors relative">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="p-3">
          <h3 className="font-medium truncate text-sm">{doc.name}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(doc.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleRemove();
          }}
          className="absolute bottom-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 group-hover:text-red-600" />
        </Button>
      </div>
    </Link>
  );
};
