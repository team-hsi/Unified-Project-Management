"use server";
import { Label, LabelPayload } from "@/feature/shared/@types/label";
import { post, put, del } from "../../../core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";
import { handleError } from "@/lib/errors";

export const createLabel = async (payload: Omit<LabelPayload, "id">) => {
  try {
    const result = await post<Label>("/v1/labels/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.LABELS(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateLabel = async (payload: Omit<LabelPayload, "projectId">) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Label>(`/v1/labels/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.LABELS(result.project.id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteLabel = async (
  payload: Pick<LabelPayload, "id" | "projectId">
) => {
  try {
    await del<void>(`/v1/labels/${payload.id}`);
    revalidateTag(CACHE_TAGS.PROJECT.LABELS(payload.projectId));
    return true;
  } catch (error) {
    return handleError(error);
  }
};
