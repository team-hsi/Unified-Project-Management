"use client";
import { DocumentCard } from "@/feature/documentation/components/document-card";
import { useDocument } from "@/feature/shared/hooks/use-document";
import { useParams } from "next/navigation";
import React from "react";

export const DocumentsView = () => {
  const { projectDocuments, isLoading, error } = useDocument();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading documents: {error.message}
      </div>
    );
  }

  if (!projectDocuments || projectDocuments.length === 0) {
    return <div className="text-gray-500 p-4">No documents found</div>;
  }

  return (
    <div className="space-y-4">
      {projectDocuments.map((doc) => (
        <DocumentCard doc={doc} workspaceId={workspaceId} key={doc.id} />
      ))}
    </div>
  );
};
