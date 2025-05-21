import { Document } from "@/feature/shared/@types/document";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";
import Link from "next/link";

export const DocumentCard = ({
  workspaceId,
  doc,
}: {
  workspaceId: string;
  doc: Document;
}) => {
  return (
    <Link href={`/${workspaceId}/${doc.projetId}/${doc.id}`} className="block">
      <div className="border w-xs rounded-lg overflow-hidden hover:border-primary transition-colors">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="p-3">
          <h3 className="font-medium truncate">{doc.name}</h3>
          <p className="text-sm text-muted-foreground">
            Updated{" "}
            {formatDistanceToNow(new Date(doc.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
};
