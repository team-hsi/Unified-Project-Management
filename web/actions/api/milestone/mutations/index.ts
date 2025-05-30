"use server";
import { post, put, del } from "../../../core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";
import { handleError } from "@/lib/errors";
import { Milestone, MilestonePayload } from "@/feature/shared/@types/milestone";

export const createMilestone = async (
  payload: Omit<MilestonePayload, "id">
) => {
  try {
    const result = await post<Milestone>("/labels/milestones/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.MILESTONES(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateMilestone = async (
  payload: Partial<Omit<MilestonePayload, "id" | "projectId">> & {
    projectId: string;
    id: string;
  }
) => {
  try {
    const { id, projectId, ...rest } = payload;
    const result = await put<Milestone>(`/labels/milestones/${id}`, { rest });
    revalidateTag(CACHE_TAGS.PROJECT.MILESTONES(projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMilestone = async (
  payload: Pick<MilestonePayload, "id" | "projectId">
) => {
  try {
    await del<void>(`/labels/milestones/${payload.id}`);
    revalidateTag(CACHE_TAGS.PROJECT.MILESTONES(payload.projectId));
    return true;
  } catch (error) {
    return handleError(error);
  }
};
