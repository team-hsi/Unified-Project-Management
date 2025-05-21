"use server";

import { get } from "@/actions/core/api-client";
import { extractErrors } from "@/lib/utils";
import { CACHE_LIFE, CACHE_TAGS } from "@/actions/core/cache-config";
import { Document, DocumentPayload } from "@/feature/shared/@types/document";

export const getAllDocuments = async () => {
  try {
    return await get<Document[]>("/documents/getall");
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectDocuments = async (id: string) => {
  try {
    return await get<Document[]>(`/projects/${id}/documents`, {
      next: {
        revalidate: CACHE_LIFE.MEDIUM,
        tags: [CACHE_TAGS.PROJECT.DOCUMENTS(id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error(extractErrors(error));
  }
};

export const getDocumentById = async (payload: Pick<DocumentPayload, "id">) => {
  try {
    return await get<Document>(`/documents/${payload.id}`, {
      next: {
        revalidate: CACHE_LIFE.MEDIUM,
        tags: [CACHE_TAGS.DOCUMENT.ONE(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching documents ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};
