"use server";
import { Label, LabelPayload } from "@/feature/shared/@types/label";
import { post, put, del } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";

export const createLabel = async (payload: Omit<LabelPayload, "id">) => {
  try {
    const result = await post<Label>("/v1/labels/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.LABELS(payload.projectId));
    return result;
  } catch (error) {
    console.error("Error creating label:", error);
    throw new Error(extractErrors(error));
  }
};

export const updateLabel = async (payload: Omit<LabelPayload, "projectId">) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Label>(`/v1/labels/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.LABELS(result.project.id));
    return result;
  } catch (error) {
    console.error("Error updating label", error);
    throw new Error(extractErrors(error));
  }
};

export const deleteLabel = async (payload: Pick<LabelPayload, "id">) => {
  //todo: add projectId to payload
  try {
    const { id } = payload;
    await del<void>(`/v1/labels/${id}`);
    // revalidateTag(CACHE_TAGS.PROJECT.LABELS(payload.projectId));
    return true;
  } catch (error) {
    console.error("Error deleting label", error);
    throw new Error(extractErrors(error));
  }
};
