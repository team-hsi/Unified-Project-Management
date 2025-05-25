"use server";
import { post, put, del } from "@/actions/core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";
import { Document, DocumentPayload } from "@/feature/shared/@types/document";

export const createDocument = async (payload: Omit<DocumentPayload, "id">) => {
  try {
    const result = await post<Document>("/documents/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.DOCUMENTS(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateDocument = async (
  payload: { id: string; projectId: string } & Partial<
    Omit<DocumentPayload, "id" | "projectId">
  >
) => {
  try {
    const { id, projectId, ...rest } = payload;
    const result = await put<Document>(`/documents/${id}`, rest);
    revalidateTag(CACHE_TAGS.DOCUMENT.ONE(id));
    revalidateTag(CACHE_TAGS.PROJECT.DOCUMENTS(projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteDocument = async (payload: {
  id: string;
  projectId: string;
}) => {
  try {
    const result = await del<void>(`/documents/${payload.id}`);
    revalidateTag(CACHE_TAGS.PROJECT.DOCUMENTS(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
