"use client";
import { DocumentCard } from "@/feature/documentation/components/document-card";
import { useDocument } from "@/feature/shared/hooks/use-document";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/feature/shared/ui/input";
import { Button } from "@/feature/shared/ui/button";
import { Search, FileSearch } from "lucide-react";

export const DocumentsView = () => {
  const { projectDocuments, isLoading, error } = useDocument();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = projectDocuments?.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
          Error loading documents: {error.message}
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const renderContent = () => {
    if (!projectDocuments || projectDocuments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4 text-gray-500">
          <p>No documents found</p>
        </div>
      );
    }

    if (searchQuery && (!filteredDocuments || filteredDocuments.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4 text-gray-500">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <p>No documents found matching &quot;{searchQuery}&quot;</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4 flex flex-wrap gap-2">
        {projectDocuments.map((doc) => (
          <DocumentCard doc={doc} workspaceId={workspaceId} key={doc.id} />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 pt-0">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </div>
  );
};
